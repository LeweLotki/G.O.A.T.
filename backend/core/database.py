"""MongoDB connection and Beanie document registration."""

from beanie import Document, init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from core.settings import settings

_client: AsyncIOMotorClient | None = None


class PlaceholderDoc(Document):
    """Registers an initial collection; replace or extend with real domain models."""

    label: str = ""

    class Settings:
        name = "placeholder"


# Register all Beanie document classes here before init_beanie runs.
DOCUMENT_MODELS: list[type[Document]] = [PlaceholderDoc]


async def connect_db() -> None:
    global _client
    _client = AsyncIOMotorClient(settings.mongo_uri)
    await init_beanie(
        database=_client[settings.mongo_db_name],
        document_models=DOCUMENT_MODELS,
    )


async def disconnect_db() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None
