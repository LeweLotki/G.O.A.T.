from fastapi import FastAPI
from middleware.cors import apply_cors

from api.health.routes import router as health_router
from api.users.routes import router as users_router
from core.lifecycle import lifespan
from core.settings import settings

app = FastAPI(title=settings.app_name, lifespan=lifespan)

apply_cors(app)

app.include_router(health_router, prefix="/health", tags=["health"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
