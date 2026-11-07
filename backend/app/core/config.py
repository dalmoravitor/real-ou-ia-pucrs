"""Configurações centralizadas da aplicação (variáveis de ambiente e caminhos)."""
import os
from pathlib import Path

APP_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = APP_DIR / "data"
CARDS_PATH = DATA_DIR / "cards.json"
VIDEOS_PATH = DATA_DIR / "videos.json"
TEXTOS_PATH = DATA_DIR / "textos.json"

MEDIA_DIR = APP_DIR / "media"
DB_PATH = Path(os.getenv("DB_PATH", APP_DIR / "leaderboard.db"))

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:5174",
    ).split(",")
    if origin.strip()
]
CORS_ORIGIN_REGEX = os.getenv("CORS_ORIGIN_REGEX", r"https://.*\.vercel\.app")

LOCAL_API_PREFIX = "http://localhost:8000"

# Limite de tempo por rodada (deve espelhar o frontend) e peso da dificuldade
ROUND_TIME_LIMIT_MS = 15_000
DIFFICULTY_ACCURACY_WEIGHT = 0.7  # o restante (0.3) vem do tempo médio de resposta
MIN_ATTEMPTS_FOR_RANKING = 5
