from fastapi import APIRouter, HTTPException

from app.schemas.stats import CardStatsDetail
from app.services import stats_service

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("/cards", response_model=list[CardStatsDetail])
def list_card_stats():
    """Dificuldade de cada card (mais difícil primeiro), com base em acerto e tempo de resposta."""
    return stats_service.list_card_stats()


@router.get("/cards/{card_id}", response_model=CardStatsDetail)
def get_card_stats(card_id: str):
    stats = stats_service.get_card_stats(card_id)
    if not stats:
        raise HTTPException(404, "Ainda não há respostas registradas para este card.")
    return stats
