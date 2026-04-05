from typing import Literal

from beanie import Document

UserNameLiteral = Literal["Marcin", "Emilia", "Ala", "Artur"]

HARDCODED_USER_NAMES: tuple[UserNameLiteral, ...] = (
    "Marcin",
    "Emilia",
    "Ala",
    "Artur",
)


class User(Document):
    """Application user; names match the fixed set seeded on startup."""

    name: UserNameLiteral

    class Settings:
        name = "users"
