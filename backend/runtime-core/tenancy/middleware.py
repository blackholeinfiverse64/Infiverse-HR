"""
Sovereign Application Runtime (SAR) - Tenant Middleware

This module provides middleware for automatic tenant context injection,
ensuring proper tenant isolation across all requests.
"""

from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from typing import Callable, Awaitable
import time
import logging
from .tenant_service import sar_tenant_resolver, TenantInfo


class TenantIsolationMiddleware:
    """Middleware to enforce tenant isolation and inject tenant context"""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        
        request = Request(scope)
        
        # Skip tenant resolution for public endpoints
        path = scope.get("path", "")
        public_endpoints = ["/", "/health", "/ready", "/docs", "/redoc", "/openapi.json"]
        if path in public_endpoints or path.endswith("/health"):
            # For public endpoints, use default tenant or none
            scope["state"] = {"tenant_info": None}
            return await self.app(scope, receive, send)
        
        try:
            # Resolve tenant from the request
            tenant_info = sar_tenant_resolver.get_tenant_from_request(request)
            
            # Add tenant info to scope state for later use
            if "state" not in scope:
                scope["state"] = {}
            scope["state"]["tenant_info"] = tenant_info
            
            # Continue with the request
            return await self.app(scope, receive, send)
        
        except Exception as e:
            # Handle tenant resolution errors gracefully
            from .tenant_service import TenantResolutionError
            
            if isinstance(e, TenantResolutionError):
                # Return 400 for tenant resolution errors
                from fastapi.responses import JSONResponse
                response = JSONResponse(
                    status_code=400,
                    content={"detail": str(e)}
                )
                await response(scope, receive, send)
                return
            else:
                # For other errors, log and continue with no tenant
                logging.error(f"Unexpected error in tenant middleware: {str(e)}")
                if "state" not in scope:
                    scope["state"] = {}
                scope["state"]["tenant_info"] = None
                return await self.app(scope, receive, send)


def get_tenant_from_request(request: Request) -> TenantInfo:
    """Helper function to get tenant info from request state"""
    if hasattr(request.state, 'tenant_info'):
        return request.state.tenant_info
    return None


def require_tenant_access(resource_tenant_id: str):
    """Decorator to enforce tenant access control on route handlers"""
    def decorator(func: Callable) -> Callable:
        async def wrapper(*args, **kwargs):
            # Get tenant info from request (assuming it's in kwargs or can be extracted)
            request = kwargs.get('request') or next((arg for arg in args if isinstance(arg, Request)), None)
            
            if not request:
                raise HTTPException(status_code=500, detail="Request object not available")
            
            tenant_info = get_tenant_from_request(request)
            if not tenant_info:
                raise HTTPException(status_code=400, detail="Tenant information not available")
            
            # Validate access
            if not sar_tenant_resolver.validate_tenant_access(tenant_info, resource_tenant_id):
                raise HTTPException(
                    status_code=403,
                    detail=f"Access denied: Tenant {tenant_info.tenant_id} cannot access resource belonging to tenant {resource_tenant_id}"
                )
            
            # Call the original function
            return await func(*args, **kwargs)
        return wrapper
    return decorator


def get_tenant_isolation_filter(table_name: str = "jobs"):
    """Get the SQL filter for tenant isolation based on the current request's tenant"""
    def decorator(func: Callable) -> Callable:
        async def wrapper(*args, **kwargs):
            # Get tenant info from request
            request = kwargs.get('request') or next((arg for arg in args if isinstance(arg, Request)), None)
            
            if not request:
                raise HTTPException(status_code=500, detail="Request object not available")
            
            tenant_info = get_tenant_from_request(request)
            if not tenant_info:
                raise HTTPException(status_code=400, detail="Tenant information not available")
            
            # Get the tenant isolation filter
            filter_clause = sar_tenant_resolver.get_tenant_isolation_query_filter(tenant_info, table_name)
            
            # Add the filter to kwargs so the function can use it
            kwargs['tenant_filter'] = filter_clause
            
            # Call the original function
            return await func(*args, **kwargs)
        return wrapper
    return decorator