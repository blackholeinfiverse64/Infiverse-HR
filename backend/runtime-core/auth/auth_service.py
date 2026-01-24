"""
Sovereign Application Runtime (SAR) - Authentication Service

This module provides a generic, multi-tenant authentication service that can be reused across
different BHIV products (HR, CRM, ERP, Nyaya, Setu, Design Tools).

Features:
- Dual authentication (API key and JWT tokens)
- Multi-tenant support with tenant isolation
- 2FA/TOTP support
- Password management and validation
- Candidate and client authentication
"""

from fastapi import HTTPException, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import jwt
from datetime import datetime, timezone, timedelta
import pyotp
import qrcode
import io
import base64
import secrets
import string
import random
import re
import bcrypt
from typing import Optional, Dict, Any, Union
from enum import Enum


class AuthType(Enum):
    """Enumeration of authentication types supported by the SAR"""
    API_KEY = "api_key"
    CLIENT_JWT = "client_jwt"
    CANDIDATE_JWT = "candidate_jwt"
    USER_JWT = "user_jwt"


class SARAuthConfig:
    """Configuration class for SAR authentication service"""
    
    def __init__(self):
        self.jwt_secret_key = os.getenv("SAR_JWT_SECRET_KEY", "default_sar_secret_key")
        self.api_key_secret = os.getenv("SAR_API_KEY_SECRET", "default_sar_api_key")
        self.candidate_jwt_secret = os.getenv("SAR_CANDIDATE_JWT_SECRET_KEY", "default_sar_candidate_secret")
        self.token_expiry_hours = int(os.getenv("SAR_TOKEN_EXPIRY_HOURS", "24"))
        self.require_2fa = os.getenv("SAR_REQUIRE_2FA", "false").lower() == "true"
        self.password_min_length = int(os.getenv("SAR_PASSWORD_MIN_LENGTH", "8"))
        self.enable_rate_limiting = os.getenv("SAR_ENABLE_RATE_LIMITING", "true").lower() == "true"


class SARAuthentication:
    """Main authentication service class for the Sovereign Application Runtime"""
    
    def __init__(self):
        self.config = SARAuthConfig()
        self.security = HTTPBearer()
        self.totp_secrets = {}  # In production, use a persistent store
    
    def validate_api_key(self, api_key: str) -> bool:
        """Validate API key against configured secret"""
        return api_key == self.config.api_key_secret
    
    def get_api_key(self, credentials: HTTPAuthorizationCredentials = Security(HTTPBearer())):
        """Dependency for API key authentication"""
        if not credentials or not self.validate_api_key(credentials.credentials):
            raise HTTPException(status_code=401, detail="Invalid API key")
        return credentials.credentials
    
    def get_auth(self, credentials: HTTPAuthorizationCredentials = Security(HTTPBearer())):
        """Dual authentication: API key or JWT token (client, candidate, or user)"""
        if not credentials:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        # Try API key first
        if self.validate_api_key(credentials.credentials):
            return {"type": AuthType.API_KEY.value, "credentials": credentials.credentials}
        
        # Try client JWT token
        try:
            payload = jwt.decode(
                credentials.credentials, 
                self.config.jwt_secret_key, 
                algorithms=["HS256"]
            )
            return {
                "type": AuthType.CLIENT_JWT.value, 
                "client_id": payload.get("client_id"),
                "tenant_id": payload.get("tenant_id", payload.get("client_id")),
                "user_id": payload.get("user_id"),
                "exp": payload.get("exp"),
                "iat": payload.get("iat")
            }
        except jwt.PyJWTError:
            pass
        
        # Try candidate JWT token
        try:
            payload = jwt.decode(
                credentials.credentials, 
                self.config.candidate_jwt_secret, 
                algorithms=["HS256"]
            )
            return {
                "type": AuthType.CANDIDATE_JWT.value, 
                "candidate_id": payload.get("candidate_id"),
                "tenant_id": payload.get("tenant_id"),
                "exp": payload.get("exp"),
                "iat": payload.get("iat")
            }
        except jwt.PyJWTError:
            pass
        
        # Try user JWT token
        try:
            payload = jwt.decode(
                credentials.credentials, 
                self.config.jwt_secret_key, 
                algorithms=["HS256"]
            )
            return {
                "type": AuthType.USER_JWT.value, 
                "user_id": payload.get("user_id"),
                "tenant_id": payload.get("tenant_id"),
                "exp": payload.get("exp"),
                "iat": payload.get("iat")
            }
        except jwt.PyJWTError:
            pass
        
        raise HTTPException(status_code=401, detail="Invalid authentication")
    
    def generate_jwt_token(self, payload_data: Dict[str, Any], token_type: AuthType = AuthType.USER_JWT) -> str:
        """Generate a JWT token with the provided payload"""
        # Add standard claims
        payload = {
            "exp": datetime.utcnow() + timedelta(hours=self.config.token_expiry_hours),
            "iat": datetime.utcnow(),
            "type": token_type.value
        }
        
        # Add custom claims
        payload.update(payload_data)
        
        # Select appropriate secret based on token type
        secret_key = self.config.jwt_secret_key
        if token_type == AuthType.CANDIDATE_JWT:
            secret_key = self.config.candidate_jwt_secret
        
        return jwt.encode(payload, secret_key, algorithm="HS256")
    
    def verify_jwt_token(self, token: str, token_type: Optional[AuthType] = None) -> Dict[str, Any]:
        """Verify a JWT token and return its payload"""
        try:
            # Select appropriate secret based on token type
            secret_key = self.config.jwt_secret_key
            if token_type == AuthType.CANDIDATE_JWT:
                secret_key = self.config.candidate_jwt_secret
            elif token_type is None:
                # Try all possible secrets
                for secret in [self.config.jwt_secret_key, self.config.candidate_jwt_secret]:
                    try:
                        payload = jwt.decode(token, secret, algorithms=["HS256"])
                        return payload
                    except jwt.PyJWTError:
                        continue
                raise jwt.PyJWTError("Invalid token")
            else:
                payload = jwt.decode(token, secret_key, algorithms=["HS256"])
                return payload
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    def setup_2fa(self, user_id: str) -> Dict[str, str]:
        """Setup 2FA TOTP for a user"""
        secret = pyotp.random_base32()
        totp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
            name=user_id,
            issuer_name="BHIV Sovereign Application Runtime"
        )
        
        # Store the secret temporarily (in production, use a secure persistent store)
        self.totp_secrets[user_id] = secret
        
        # Generate QR code
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(totp_uri)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG')
        img_str = base64.b64encode(img_buffer.getvalue()).decode()
        
        return {
            "user_id": user_id,
            "secret": secret,
            "qr_code": f"data:image/png;base64,{img_str}",
            "manual_entry_key": secret,
            "instructions": "Scan QR code with Google Authenticator, Microsoft Authenticator, or Authy"
        }
    
    def verify_2fa(self, user_id: str, totp_code: str) -> bool:
        """Verify 2FA TOTP code"""
        secret = self.totp_secrets.get(user_id)
        if not secret:
            return False
        
        totp = pyotp.TOTP(secret)
        return totp.verify(totp_code, valid_window=1)
    
    def validate_password(self, password: str) -> Dict[str, Union[int, str, list]]:
        """Validate password strength and return feedback"""
        score = 0
        feedback = []
        
        # Length check
        if len(password) >= self.config.password_min_length:
            score += 20
        else:
            feedback.append(f"Password should be at least {self.config.password_min_length} characters long")
        
        # Uppercase check
        if any(c.isupper() for c in password):
            score += 20
        else:
            feedback.append("Password should contain uppercase letters")
        
        # Lowercase check
        if any(c.islower() for c in password):
            score += 20
        else:
            feedback.append("Password should contain lowercase letters")
        
        # Digit check
        if any(c.isdigit() for c in password):
            score += 20
        else:
            feedback.append("Password should contain numbers")
        
        # Special character check
        if any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
            score += 20
        else:
            feedback.append("Password should contain special characters")
        
        # Determine strength
        strength = "Very Weak"
        if score >= 80:
            strength = "Very Strong"
        elif score >= 60:
            strength = "Strong"
        elif score >= 40:
            strength = "Medium"
        elif score >= 20:
            strength = "Weak"
        
        return {
            "password_strength": strength,
            "score": score,
            "max_score": 100,
            "is_valid": score >= 60,
            "feedback": feedback
        }
    
    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def generate_password(self, length: int = 12, include_symbols: bool = True) -> str:
        """Generate a secure random password"""
        if length < 8 or length > 128:
            raise ValueError("Password length must be between 8 and 128 characters")
        
        chars = string.ascii_letters + string.digits
        if include_symbols:
            chars += "!@#$%^&*()_+-="
        
        return ''.join(random.choice(chars) for _ in range(length))
    
    def validate_email(self, email: str) -> bool:
        """Validate email format"""
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(email_pattern, email) is not None
    
    def validate_phone(self, phone: str) -> bool:
        """Validate phone number format (Indian format by default)"""
        phone_pattern = r'^(\+91|91)?[6-9]\d{9}$'
        return re.match(phone_pattern, phone) is not None


# Global instance of the authentication service
sar_auth = SARAuthentication()


# Convenience functions for use as FastAPI dependencies
def auth_dependency(credentials: HTTPAuthorizationCredentials = Security(sar_auth.security)):
    """Standard auth dependency for all services"""
    return sar_auth.get_auth(credentials)


def api_key_dependency(credentials: HTTPAuthorizationCredentials = Security(sar_auth.security)):
    """API key auth dependency for services requiring API key only"""
    if not credentials or not sar_auth.validate_api_key(credentials.credentials):
        raise HTTPException(status_code=401, detail="Invalid API key")
    return credentials.credentials