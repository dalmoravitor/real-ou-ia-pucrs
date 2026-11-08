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

# Domínio público do frontend em produção (Railway)
PRODUCTION_FRONTEND_URL = "https://real-ou-ia.up.railway.app"


def _build_cors_origins() -> list[str]:
    origins = [
        origin.strip().rstrip("/")
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://localhost:5174",
        ).split(",")
        if origin.strip()
    ]
    # Sempre libera o frontend de produção, mesmo que CORS_ORIGINS esteja desatualizada.
    origins.append(PRODUCTION_FRONTEND_URL)
    # O Railway injeta o domínio atual do serviço "web" em RAILWAY_SERVICE_WEB_URL;
    # assim, se o domínio do frontend mudar de novo, o backend acompanha no próximo deploy.
    railway_web_domain = os.getenv("RAILWAY_SERVICE_WEB_URL", "").strip().rstrip("/")
    if railway_web_domain:
        origins.append(f"https://{railway_web_domain.removeprefix('https://')}")
    return list(dict.fromkeys(origins))


CORS_ORIGINS = _build_cors_origins()
CORS_ORIGIN_REGEX = os.getenv("CORS_ORIGIN_REGEX", r"https://.*\.vercel\.app")

LOCAL_API_PREFIX = "http://localhost:8000"

# Limite de tempo por rodada (deve espelhar o frontend) e peso da dificuldade
ROUND_TIME_LIMIT_MS = 15_000
DIFFICULTY_ACCURACY_WEIGHT = 0.7  # o restante (0.3) vem do tempo médio de resposta
MIN_ATTEMPTS_FOR_RANKING = 5
