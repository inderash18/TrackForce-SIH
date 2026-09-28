from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User

# Role hierarchy and permissions definition
ROLE_PERMISSIONS = {
    "SUPER_ADMIN": [
        "projects.read", "projects.manage", "alerts.read", "alerts.manage",
        "analytics.read", "reports.generate", "data.upload", "models.view",
        "models.manage", "users.manage", "system.manage"
    ],
    "MOSPI_ADMIN": [
        "projects.read", "projects.manage", "alerts.read", "alerts.manage",
        "analytics.read", "reports.generate", "data.upload", "models.view",
        "models.manage", "users.manage"
    ],
    "MINISTRY_OFFICER": [
        "projects.read", "projects.manage", "alerts.read", "alerts.manage",
        "analytics.read", "reports.generate", "data.upload", "models.view"
    ],
    "PROJECT_ADMIN": [
        "projects.read", "projects.manage", "alerts.read", "alerts.manage",
        "analytics.read", "reports.generate", "data.upload"
    ],
    "ANALYST": [
        "projects.read", "alerts.read", "analytics.read", "reports.generate",
        "models.view"
    ],
    "VIEWER": [
        "projects.read", "alerts.read", "analytics.read"
    ]
}

security_scheme = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    if not credentials:
        # For public or development endpoints fallback gracefully or raise 401
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account has been deactivated",
        )
    return user

def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not credentials:
        return None
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        return None
    user_id = payload.get("sub")
    return db.query(User).filter(User.id == user_id).first()

def require_permission(permission: str):
    def permission_checker(current_user: User = Depends(get_current_user)):
        user_role = current_user.role
        allowed_permissions = ROLE_PERMISSIONS.get(user_role, [])
        if permission not in allowed_permissions and user_role != "SUPER_ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{permission}' denied for role '{user_role}'"
            )
        return current_user
    return permission_checker
