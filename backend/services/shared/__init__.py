"""
Shared modules for BHIV HR Platform Backend Services
"""

from .jwt_auth import (
    security,
    validate_api_key,
    get_api_key,
    get_auth,
    auth_dependency,
    verify_jwt_token,
    get_user_from_token,
    require_role,
    get_candidate_auth,
    get_recruiter_auth,
    get_client_auth,
    get_admin_auth,
    get_optional_auth,
)

__all__ = [
    "security",
    "validate_api_key",
    "get_api_key",
    "get_auth",
    "auth_dependency",
    "verify_jwt_token",
    "get_user_from_token",
    "require_role",
    "get_candidate_auth",
    "get_recruiter_auth",
    "get_client_auth",
    "get_admin_auth",
    "get_optional_auth",
]
