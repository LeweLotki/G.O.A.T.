from pydantic import BaseModel, Field


class UserListResponseModel(BaseModel):
    name: str = Field(description="Display name for login selection")
