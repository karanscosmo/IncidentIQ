from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    api_title: str = "IncidentIQ API"
    api_version: str = "1.0.0"
    
    hindsight_base_url: str = Field(default="https://api.hindsight.vectorize.io")
    hindsight_api_key: str = Field(...)
    hindsight_memory_bank: str = Field(default="incidentiq-prod")
    openai_api_key: str = Field(default="dummy")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
