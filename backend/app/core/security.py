import base64
import hashlib
import hmac
import json
from datetime import datetime, timedelta, timezone
from typing import Any, Union, Optional

try:
    from jose import jwt, JWTError
    HAS_JOSE = True
except ImportError:
    try:
        import jwt
        from jwt import PyJWTError as JWTError
        HAS_JOSE = True
    except ImportError:
        HAS_JOSE = False
        JWTError = Exception

try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    HAS_PASSLIB = True
except ImportError:
    HAS_PASSLIB = False

from app.core.config import settings

def _simple_sign(payload: dict, secret: str) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    signature = hmac.new(secret.encode(), f"{header_b64}.{payload_b64}".encode(), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def _simple_verify(token: str, secret: str) -> Optional[dict]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        expected_sig = hmac.new(secret.encode(), f"{header_b64}.{payload_b64}".encode(), hashlib.sha256).digest()
        actual_sig = base64.urlsafe_b64decode(sig_b64 + "==")
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
        payload_bytes = base64.urlsafe_b64decode(payload_b64 + "==")
        payload = json.loads(payload_bytes.decode())
        exp = payload.get("exp")
        if exp and datetime.fromtimestamp(exp, tz=timezone.utc) < datetime.now(timezone.utc):
            return None
        return payload
    except Exception:
        return None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if HAS_PASSLIB and (hashed_password.startswith("$2b$") or hashed_password.startswith("$2a$")):
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            pass
    # Fallback to sha256 or direct comparison for development/testing
    hashed_plain = hashlib.sha256(plain_password.encode()).hexdigest()
    return hashed_password == hashed_plain or plain_password == hashed_password

def get_password_hash(password: str) -> str:
    if HAS_PASSLIB:
        try:
            return pwd_context.hash(password)
        except Exception:
            pass
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": int(expire.timestamp()), "sub": str(subject), "type": "access"}
    if HAS_JOSE:
        try:
            return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
        except Exception:
            pass
    return _simple_sign(to_encode, settings.JWT_SECRET)

def create_refresh_token(subject: Union[str, Any]) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {"exp": int(expire.timestamp()), "sub": str(subject), "type": "refresh"}
    if HAS_JOSE:
        try:
            return jwt.encode(to_encode, settings.JWT_REFRESH_SECRET, algorithm=settings.ALGORITHM)
        except Exception:
            pass
    return _simple_sign(to_encode, settings.JWT_REFRESH_SECRET)

def decode_token(token: str, is_refresh: bool = False) -> Optional[dict]:
    secret = settings.JWT_REFRESH_SECRET if is_refresh else settings.JWT_SECRET
    if HAS_JOSE:
        try:
            return jwt.decode(token, secret, algorithms=[settings.ALGORITHM])
        except Exception:
            pass
    return _simple_verify(token, secret)
