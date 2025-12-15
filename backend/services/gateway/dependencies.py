"""
Gateway Authentication Dependencies
Uses Supabase JWT tokens for user authentication
"""

# Re-export from shared Supabase auth module
import sys
import os

# Add shared module to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'shared'))

from supabase_auth import (
    security,
    validate_api_key,
    get_api_key,
    get_auth,
    auth_dependency,
    verify_supabase_token,
    get_user_from_token,
    require_role,
    get_candidate_auth,
    get_recruiter_auth,
    get_client_auth,
    get_admin_auth,
    get_optional_auth,
)

# Re-export all for backwards compatibility
__all__ = [
    "security",
    "validate_api_key",
    "get_api_key",
    "get_auth",
    "auth_dependency",
    "verify_supabase_token",
    "get_user_from_token",
    "require_role",
    "get_candidate_auth",
    "get_recruiter_auth",
    "get_client_auth",
    "get_admin_auth",
    "get_optional_auth",
]
