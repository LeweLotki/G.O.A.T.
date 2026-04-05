"""MongoDB connection and Beanie document registration."""

from collections.abc import Sequence

from beanie import Document, init_beanie
from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase

from core.settings import settings

_client: AsyncMongoClient | None = None
_database: AsyncDatabase | None = None


from api.users.models import User

DOCUMENT_MODELS: Sequence[type[Document]] = (User,)


async def connect_db() -> None:
    """Create MongoDB client and initialize Beanie."""
    global _client, _database

    if _client is not None:
        return

    if not DOCUMENT_MODELS:
        raise RuntimeError(
            "DOCUMENT_MODELS is empty. Import and register your Beanie documents "
            "before calling connect_db()."
        )

    _client = AsyncMongoClient(settings.mongo_uri)
    await _client.admin.command("ping")

    _database = _client[settings.mongo_db_name]

    await init_beanie(
        database=_database,
        document_models=list(DOCUMENT_MODELS),
    )


async def disconnect_db() -> None:
    """Close MongoDB client."""
    global _client, _database

    if _client is not None:
        await _client.close()
        _client = None
        _database = None


def get_database() -> AsyncDatabase:
    """Return initialized MongoDB database instance."""
    if _database is None:
        raise RuntimeError("Database is not connected. Call connect_db() first.")
    return _database