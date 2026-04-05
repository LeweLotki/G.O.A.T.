from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.health.routes import router as health_router
from core.lifecycle import lifespan
from core.settings import settings

app = FastAPI(title=settings.app_name, lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(health_router, prefix="/health", tags=["health"])
