from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import cards, leaderboard, stats
from app.core import config
from app.db.database import init_db


def create_app() -> FastAPI:
    app = FastAPI(title="AI Tinder API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=config.CORS_ORIGINS,
        allow_origin_regex=config.CORS_ORIGIN_REGEX,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    init_db()

    if config.MEDIA_DIR.exists():
        app.mount("/media", StaticFiles(directory=config.MEDIA_DIR), name="media")

    app.include_router(cards.router)
    app.include_router(leaderboard.router)
    app.include_router(stats.router)
    return app


app = create_app()
