"""
Sovereign Application Runtime (SAR) - Tenant Resolution Service

This module provides tenant resolution and isolation functionality for the SAR.
It ensures proper tenant context throughout the application lifecycle and prevents
cross-tenant data leakage.
"""

from fastapi import HTTPException, Request, Depends
from typing import Optional, Dict, Any, Union
from enum import Enum
import os
import jwt
from datetime import datetime, timezone
import re


class TenantType(Enum):
    """Enumeration of tenant types supported by the SAR"""
    CLIENT = "client"
    ORGANIZATION = "organization"
    ENTERPRISE = "enterprise"
    GOVERNMENT = "government"


class TenantResolutionError(Exception):
    """Custom exception for tenant resolution errors"""
    pass


class TenantConfig:
    """Configuration class for SAR tenant resolution service"""
    
    def __init__(self):
        self.jwt_secret_key = os.getenv("SAR_JWT_SECRET_KEY", "default_sar_secret_key")
        self.tenant_isolation_enabled = os.getenv("SAR_TENANT_ISOLATION_ENABLED", "true").lower() == "true"
        self.require_tenant_header = os.getenv("SAR_REQUIRE_TENANT_HEADER", "false").lower() == "true"
        self.default_tenant_id = os.getenv("SAR_DEFAULT_TENANT_ID", "default")
        self.tenant_header_name = os.getenv("SAR_TENANT_HEADER_NAME", "X-Tenant-ID")
        self.tenant_context_key = os.getenv("SAR_TENANT_CONTEXT_KEY", "tenant_id")


class TenantInfo:
    """Class to hold tenant information"""
    
    def __init__(self, tenant_id: str, tenant_type: TenantType, name: str = "", metadata: Optional[Dict[str, Any]] = None):
        self.tenant_id = tenant_id
        self.tenant_type = tenant_type
        self.name = name
        self.metadata = metadata or {}
        self.created_at = datetime.now(timezone.utc)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "tenant_id": self.tenant_id,
            "tenant_type": self.tenant_type.value,
            "name": self.name,
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat()
        }


class TenantResolver:
    """Main tenant resolution service class for the Sovereign Application Runtime"""
    
    def __init__(self):
        self.config = TenantConfig()
        self.tenant_cache = {}  # In production, use a distributed cache
    
    def get_tenant_from_jwt(self, token: str) -> Optional[TenantInfo]:
        """Extract tenant information from JWT token"""
        try:
            payload = jwt.decode(token, self.config.jwt_secret_key, algorithms=["HS256"])
            
            # Extract tenant information from JWT claims
            tenant_id = payload.get("tenant_id") or payload.get("client_id")
            if not tenant_id:
                return None
            
            tenant_type_str = payload.get("tenant_type", "client")
            try:
                tenant_type = TenantType(tenant_type_str.lower())
            except ValueError:
                tenant_type = TenantType.CLIENT  # Default fallback
            
            return TenantInfo(
                tenant_id=tenant_id,
                tenant_type=tenant_type,
                name=payload.get("tenant_name", payload.get("company_name", "")),
                metadata={
                    "exp": payload.get("exp"),
                    "iat": payload.get("iat"),
                    "permissions": payload.get("permissions", []),
                    "source": "jwt"
                }
            )
        except jwt.PyJWTError:
            return None
    
    def get_tenant_from_header(self, request: Request) -> Optional[TenantInfo]:
        """Extract tenant information from request headers"""
        tenant_id = request.headers.get(self.config.tenant_header_name)
        if not tenant_id:
            return None
        
        return TenantInfo(
            tenant_id=tenant_id,
            tenant_type=TenantType.CLIENT,  # Default type for header-based tenants
            metadata={"source": "header"}
        )
    
    def get_tenant_from_request(self, request: Request) -> Optional[TenantInfo]:
        """Get tenant information from the incoming request using multiple strategies"""
        # Try to get tenant from Authorization header (JWT)
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]  # Remove "Bearer " prefix
            tenant_info = self.get_tenant_from_jwt(token)
            if tenant_info:
                return tenant_info
        
        # Try to get tenant from custom header
        tenant_info = self.get_tenant_from_header(request)
        if tenant_info:
            return tenant_info
        
        # If no tenant found and required, raise an error
        if self.config.require_tenant_header:
            raise TenantResolutionError("Tenant ID is required but not found in request")
        
        # Return default tenant if available
        if self.config.default_tenant_id:
            return TenantInfo(
                tenant_id=self.config.default_tenant_id,
                tenant_type=TenantType.CLIENT,
                metadata={"source": "default"}
            )
        
        return None
    
    def validate_tenant_access(self, tenant_info: TenantInfo, resource_tenant_id: str) -> bool:
        """Validate that a tenant has access to a specific resource"""
        if not self.config.tenant_isolation_enabled:
            return True  # Bypass validation if isolation is disabled
        
        return tenant_info.tenant_id == resource_tenant_id
    
    def get_tenant_isolation_query_filter(self, tenant_info: TenantInfo, table_name: str = "jobs") -> str:
        """Get the SQL query filter for tenant isolation"""
        if not self.config.tenant_isolation_enabled:
            return ""  # No filter needed if isolation is disabled
        
        # Determine the appropriate column name based on table
        if table_name in ["jobs", "offers", "feedback", "interviews"]:
            column = "client_id"
        elif table_name in ["candidates", "users"]:
            column = "tenant_id"  # For tenant-scoped tables
        else:
            column = "tenant_id"  # Default
        
        return f"{column} = '{tenant_info.tenant_id}'"
    
    def create_tenant_context(self, tenant_info: TenantInfo) -> Dict[str, Any]:
        """Create a tenant context dictionary for use in request handlers"""
        return {
            self.config.tenant_context_key: tenant_info.tenant_id,
            "tenant_info": tenant_info.to_dict(),
            "tenant_isolation_enabled": self.config.tenant_isolation_enabled
        }
    
    def validate_cross_tenant_request(self, requesting_tenant: TenantInfo, target_tenant_id: str) -> bool:
        """Validate if a cross-tenant request is allowed"""
        if not self.config.tenant_isolation_enabled:
            return True
        
        # For now, only allow requests within the same tenant
        # In the future, this could be extended with cross-tenant permissions
        return requesting_tenant.tenant_id == target_tenant_id
    
    def get_shared_resource_access(self, tenant_info: TenantInfo, resource_type: str) -> bool:
        """Check if a tenant has access to shared resources of a specific type"""
        # Define which resources are shared across tenants
        shared_resources = {
            "candidates": True,  # Candidates are shared across tenants
            "users": False,      # Users are tenant-specific
            "jobs": False,       # Jobs are tenant-specific
            "feedback": False,   # Feedback is tenant-specific
        }
        
        return shared_resources.get(resource_type, False)


# Global instance of the tenant resolver
sar_tenant_resolver = TenantResolver()


# FastAPI dependency for tenant resolution
async def get_tenant_info(request: Request):
    """FastAPI dependency to get tenant information from the request"""
    try:
        tenant_info = sar_tenant_resolver.get_tenant_from_request(request)
        if not tenant_info and sar_tenant_resolver.config.require_tenant_header:
            raise HTTPException(status_code=400, detail="Tenant ID is required")
        return tenant_info
    except TenantResolutionError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tenant resolution error: {str(e)}")


# Convenience function to validate tenant access to resources
def validate_tenant_access_to_resource(tenant_info: TenantInfo, resource_tenant_id: str):
    """Validate that a tenant has access to a specific resource, raising HTTPException if not"""
    if not sar_tenant_resolver.validate_tenant_access(tenant_info, resource_tenant_id):
        raise HTTPException(
            status_code=403, 
            detail=f"Access denied: Tenant {tenant_info.tenant_id} cannot access resource belonging to tenant {resource_tenant_id}"
        )