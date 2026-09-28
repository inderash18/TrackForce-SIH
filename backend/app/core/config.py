import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "PAIMANA Sentinel AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    APP_ENV: str = Field(default="development", env="APP_ENV")
    
    # Security
    JWT_SECRET: str = Field(default="paimana-sentinel-ultra-secure-key-2026-gov-ai-intelligence", env="JWT_SECRET")
    JWT_REFRESH_SECRET: str = Field(default="paimana-refresh-secret-jwt-key-2026-secure", env="JWT_REFRESH_SECRET")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Database
    DATABASE_URL: str = Field(
        default="sqlite:///./paimana_sentinel.db",
        env="DATABASE_URL"
    )
    
    # Redis & Cache
    REDIS_URL: str = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    
    # AI & Ollama RAG
    OLLAMA_URL: str = Field(default="http://localhost:11434", env="OLLAMA_URL")
    OLLAMA_MODEL: str = Field(default="qwen2.5:7b", env="OLLAMA_MODEL")
    EMBEDDING_MODEL: str = "nomic-embed-text"
    
    # ML Models path
    MODEL_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "ml", "models")
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
