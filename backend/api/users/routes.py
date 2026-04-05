from fastapi import APIRouter

from api.users import crud
from api.users.schemas import UserListResponseModel

router = APIRouter()


@router.get("", response_model=list[UserListResponseModel])
async def get_users() -> list[UserListResponseModel]:
    return await crud.list_users()
