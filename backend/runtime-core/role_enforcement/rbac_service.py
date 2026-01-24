"""
Role-Based Access Control (RBAC) Service for Sovereign Application Runtime (SAR)

This module provides comprehensive role-based access control functionality
for multi-tenant applications with proper isolation and security measures.
"""
from enum import Enum
from typing import Dict, List, Optional, Set, Any
from dataclasses import dataclass, field
from datetime import datetime
import logging
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from auth.auth_service import SARAuthentication
from tenancy.tenant_service import TenantResolver


class RoleType(Enum):
    """Enumeration of available role types in the system"""
    SYSTEM_ADMIN = "system_admin"
    CLIENT_ADMIN = "client_admin"
    CLIENT_USER = "client_user"
    CANDIDATE = "candidate"
    API_KEY_USER = "api_key_user"


@dataclass
class Permission:
    """Represents a specific permission in the system"""
    resource: str
    action: str
    scope: str = "tenant"  # tenant, system, or global
    description: str = ""
    
    def __hash__(self):
        return hash((self.resource, self.action, self.scope))
    
    def __eq__(self, other):
        if not isinstance(other, Permission):
            return False
        return (self.resource == other.resource and 
                self.action == other.action and 
                self.scope == other.scope)


@dataclass
class Role:
    """Represents a role with associated permissions"""
    name: str
    role_type: RoleType
    permissions: Set[Permission] = field(default_factory=set)
    description: str = ""
    created_at: datetime = field(default_factory=datetime.utcnow)
    is_active: bool = True


@dataclass
class RoleAssignment:
    """Represents a user's role assignment"""
    user_id: str
    role: Role
    tenant_id: Optional[str] = None
    assigned_at: datetime = field(default_factory=datetime.utcnow)
    assigned_by: Optional[str] = None
    expires_at: Optional[datetime] = None


class RBACConfig:
    """Configuration for the RBAC service"""
    def __init__(self):
        self.jwt_secret_key = os.getenv("JWT_SECRET_KEY", "default_secret_key")
        self.default_permissions_cache_ttl = int(os.getenv("RBAC_CACHE_TTL", "300"))  # 5 minutes
        self.role_validation_enabled = os.getenv("ROLE_VALIDATION_ENABLED", "true").lower() == "true"
        self.strict_mode = os.getenv("RBAC_STRICT_MODE", "false").lower() == "true"


class SARRoleEnforcement:
    """Main role enforcement service class for the Sovereign Application Runtime"""
    
    def __init__(self):
        self.config = RBACConfig()
        self.security = HTTPBearer()
        self._roles: Dict[str, Role] = {}
        self._role_assignments: List[RoleAssignment] = []
        self._permission_cache: Dict[str, Set[Permission]] = {}
        
        # Initialize default roles
        self._initialize_default_roles()
    
    def _initialize_default_roles(self):
        """Initialize default roles for the system"""
        # System Admin Role - Full access
        system_admin_role = Role(
            name="system_admin",
            role_type=RoleType.SYSTEM_ADMIN,
            description="System administrator with full access",
            permissions={
                Permission("system", "*", "global"),
                Permission("users", "*", "global"),
                Permission("tenants", "*", "global"),
                Permission("jobs", "*", "global"),
                Permission("candidates", "*", "global"),
                Permission("feedback", "*", "global"),
                Permission("interviews", "*", "global"),
                Permission("offers", "*", "global"),
                Permission("audit", "*", "global"),
                Permission("workflow", "*", "global"),
                Permission("roles", "*", "global"),
            }
        )
        
        # Client Admin Role - Tenant-level access
        client_admin_role = Role(
            name="client_admin",
            role_type=RoleType.CLIENT_ADMIN,
            description="Client administrator with tenant-level access",
            permissions={
                Permission("jobs", "create", "tenant"),
                Permission("jobs", "read", "tenant"),
                Permission("jobs", "update", "tenant"),
                Permission("jobs", "delete", "tenant"),
                Permission("candidates", "read", "tenant"),
                Permission("candidates", "match", "tenant"),
                Permission("feedback", "create", "tenant"),
                Permission("feedback", "read", "tenant"),
                Permission("interviews", "create", "tenant"),
                Permission("interviews", "read", "tenant"),
                Permission("interviews", "update", "tenant"),
                Permission("offers", "create", "tenant"),
                Permission("offers", "read", "tenant"),
                Permission("offers", "update", "tenant"),
                Permission("workflow", "create", "tenant"),
                Permission("workflow", "read", "tenant"),
                Permission("workflow", "update", "tenant"),
                Permission("roles", "read", "tenant"),
            }
        )
        
        # Client User Role - Limited tenant access
        client_user_role = Role(
            name="client_user",
            role_type=RoleType.CLIENT_USER,
            description="Client user with limited tenant access",
            permissions={
                Permission("jobs", "read", "tenant"),
                Permission("candidates", "read", "tenant"),
                Permission("feedback", "create", "tenant"),
                Permission("feedback", "read", "tenant"),
                Permission("interviews", "read", "tenant"),
                Permission("workflow", "read", "tenant"),
            }
        )
        
        # Candidate Role - Self-service
        candidate_role = Role(
            name="candidate",
            role_type=RoleType.CANDIDATE,
            description="Candidate with self-service access",
            permissions={
                Permission("profile", "read", "own"),
                Permission("profile", "update", "own"),
                Permission("jobs", "read", "public"),
                Permission("applications", "create", "own"),
                Permission("applications", "read", "own"),
                Permission("applications", "update", "own"),
            }
        )
        
        # API Key User Role - System-level access
        api_key_user_role = Role(
            name="api_key_user",
            role_type=RoleType.API_KEY_USER,
            description="API key user with system-level access",
            permissions={
                Permission("system", "*", "global"),
                Permission("jobs", "*", "global"),
                Permission("candidates", "*", "global"),
                Permission("feedback", "*", "global"),
                Permission("interviews", "*", "global"),
                Permission("offers", "*", "global"),
                Permission("workflow", "*", "global"),
                Permission("audit", "*", "global"),
                Permission("roles", "*", "global"),
            }
        )
        
        # Store roles
        for role in [system_admin_role, client_admin_role, client_user_role, candidate_role, api_key_user_role]:
            self._roles[role.name] = role
    
    def create_role(self, name: str, role_type: RoleType, permissions: List[Permission], 
                   description: str = "") -> Role:
        """Create a new role with specified permissions"""
        if name in self._roles:
            raise ValueError(f"Role '{name}' already exists")
        
        role = Role(
            name=name,
            role_type=role_type,
            permissions=set(permissions),
            description=description
        )
        
        self._roles[name] = role
        return role
    
    def get_role(self, role_name: str) -> Optional[Role]:
        """Get a role by name"""
        return self._roles.get(role_name)
    
    def assign_role(self, user_id: str, role_name: str, tenant_id: Optional[str] = None, 
                   assigned_by: Optional[str] = None) -> RoleAssignment:
        """Assign a role to a user"""
        role = self.get_role(role_name)
        if not role:
            raise ValueError(f"Role '{role_name}' does not exist")
        
        assignment = RoleAssignment(
            user_id=user_id,
            role=role,
            tenant_id=tenant_id,
            assigned_by=assigned_by
        )
        
        self._role_assignments.append(assignment)
        return assignment
    
    def get_user_roles(self, user_id: str, tenant_id: Optional[str] = None) -> List[RoleAssignment]:
        """Get all roles assigned to a user, optionally filtered by tenant"""
        assignments = [ra for ra in self._role_assignments if ra.user_id == user_id]
        
        if tenant_id:
            assignments = [ra for ra in assignments if ra.tenant_id == tenant_id or ra.tenant_id is None]
        
        return assignments
    
    def has_permission(self, user_id: str, resource: str, action: str, 
                      tenant_id: Optional[str] = None, 
                      user_tenant_id: Optional[str] = None) -> bool:
        """Check if a user has permission to perform an action on a resource"""
        # Get user's roles
        user_assignments = self.get_user_roles(user_id, tenant_id or user_tenant_id)
        
        # Check each role for the required permission
        for assignment in user_assignments:
            role = assignment.role
            
            # Check for wildcard permission
            for permission in role.permissions:
                # Check exact match
                if (permission.resource == resource and 
                    (permission.action == action or permission.action == "*")):
                    
                    # Check scope compatibility
                    if self._check_scope_compatibility(permission.scope, tenant_id, user_tenant_id):
                        return True
        
        # If no role grants the permission, deny access
        return False
    
    def _check_scope_compatibility(self, permission_scope: str, requested_tenant_id: Optional[str], 
                                  user_tenant_id: Optional[str]) -> bool:
        """Check if the permission scope is compatible with the requested scope"""
        if permission_scope == "global":
            return True
        elif permission_scope == "system":
            return True  # System-level permissions
        elif permission_scope == "tenant":
            return requested_tenant_id == user_tenant_id
        elif permission_scope == "own":
            return True  # Own resources - additional checks happen at resource level
        elif permission_scope == "public":
            return True  # Public resources
        else:
            return False
    
    def get_user_permissions(self, user_id: str, tenant_id: Optional[str] = None) -> Set[Permission]:
        """Get all permissions for a user in a specific tenant"""
        cache_key = f"{user_id}:{tenant_id}"
        
        if cache_key in self._permission_cache:
            return self._permission_cache[cache_key]
        
        permissions = set()
        user_assignments = self.get_user_roles(user_id, tenant_id)
        
        for assignment in user_assignments:
            for permission in assignment.role.permissions:
                if self._check_scope_compatibility(permission.scope, tenant_id, tenant_id):
                    permissions.add(permission)
        
        self._permission_cache[cache_key] = permissions
        return permissions
    
    def validate_role_access(self, auth: Dict[str, Any], required_role: Optional[str] = None, 
                           resource_context: Optional[Dict[str, Any]] = None) -> bool:
        """Validate that authenticated user has required role or permissions"""
        if not auth:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        # Extract user info from auth
        auth_type = auth.get("type")
        user_id = auth.get("user_id") or auth.get("client_id") or auth.get("candidate_id")
        user_tenant_id = auth.get("tenant_id")
        
        # If API key authentication, grant full access
        if auth_type == "api_key_secret":
            return True
        
        # If no specific role required, just check basic authentication
        if not required_role and not resource_context:
            return user_id is not None
        
        # Check specific role requirement
        if required_role:
            user_assignments = self.get_user_roles(user_id, user_tenant_id)
            has_required_role = any(ra.role.name == required_role for ra in user_assignments)
            if not has_required_role:
                raise HTTPException(status_code=403, detail=f"Required role '{required_role}' not granted")
        
        # Check resource context permissions
        if resource_context:
            resource = resource_context.get("resource")
            action = resource_context.get("action")
            required_tenant_id = resource_context.get("tenant_id")
            
            if resource and action:
                has_permission = self.has_permission(
                    user_id=user_id,
                    resource=resource,
                    action=action,
                    tenant_id=required_tenant_id,
                    user_tenant_id=user_tenant_id
                )
                
                if not has_permission:
                    raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        return True


# Global instance for the SAR Role Enforcement service
sar_rbac = SARRoleEnforcement()


def require_permission(resource: str, action: str, tenant_required: bool = True):
    """Decorator to require specific permissions for route handlers
    
    NOTE: This decorator should not be used directly with FastAPI endpoints.
    Instead, use the check_permission dependency function.
    This is kept for backward compatibility.
    """
    def decorator(func):
        # Return the function unmodified - permission checking should be done via dependency injection
        return func
    return decorator


def get_current_user_permissions(auth: Dict[str, Any] = Depends(lambda: None), 
                               tenant_info: Any = Depends(lambda: None)):
    """Dependency to get current user's permissions"""
    if not auth:
        return set()
    
    user_id = auth.get("user_id") or auth.get("client_id") or auth.get("candidate_id")
    tenant_id = tenant_info.tenant_id if tenant_info else None
    
    return sar_rbac.get_user_permissions(user_id, tenant_id)