from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(frozen=True, extra="ignore")

    app_name: str = Field(default="goat")
    mongo_uri: str = Field(default="mongodb://mongo:27017")
    mongo_db_name: str = Field(default="goat")


settings = Settings()
