from api.users.models import HARDCODED_USER_NAMES, User
from api.users.schemas import UserListResponseModel


async def seed_users_if_empty() -> None:
    if await User.count() > 0:
        return
    await User.insert_many([User(name=n) for n in HARDCODED_USER_NAMES])


async def list_users() -> list[UserListResponseModel]:
    users = await User.find().sort(+User.name).to_list()
    return [UserListResponseModel(name=u.name) for u in users]
