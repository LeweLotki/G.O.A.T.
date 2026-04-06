from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve .env next to package / cwd — backend runs with WORKDIR /app in Docker.
_ENV_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        frozen=True,
        extra="ignore",
        env_file=_ENV_DIR / ".env",
        env_file_encoding="utf-8",
    )

    app_name: str = Field(default="goat")
    mongo_uri: str = Field(default="mongodb://mongo:27017")
    mongo_db_name: str = Field(default="goat")

    github_token: str = Field(
        default="",
        validation_alias=AliasChoices("GITHUB_TOKEN"),
    )
    github_owner: str = Field(
        default="",
        validation_alias=AliasChoices("OWNER"),
    )
    github_repo: str = Field(
        default="",
        validation_alias=AliasChoices("REPO"),
    )
    github_default_branch: str = Field(
        default="main",
        validation_alias=AliasChoices("GITHUB_DEFAULT_BRANCH"),
    )


settings = Settings()
