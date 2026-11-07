"""Cálculo de dificuldade dos cards a partir das respostas registradas."""
from typing import Optional

from app.core.config import (
    DIFFICULTY_ACCURACY_WEIGHT,
    MIN_ATTEMPTS_FOR_RANKING,
    ROUND_TIME_LIMIT_MS,
)
from app.repositories import cards_repository, stats_repository
from app.schemas.stats import CardStatsDetail


def _label(difficulty: float) -> str:
    if difficulty < 0.33:
        return "fácil"
    if difficulty < 0.55:
        return "média"
    return "difícil"


def _build(row: dict) -> CardStatsDetail:
    attempts = row["attempts"]
    correct = row["correct"] or 0
    accuracy = correct / attempts
    avg_ms = row["avg_response_time_ms"] or 0.0
    time_factor = min(avg_ms / ROUND_TIME_LIMIT_MS, 1.0)
    difficulty = DIFFICULTY_ACCURACY_WEIGHT * (1 - accuracy) + (1 - DIFFICULTY_ACCURACY_WEIGHT) * time_factor

    card = cards_repository.find_card(row["card_id"]) or {}
    return CardStatsDetail(
        card_id=row["card_id"],
        attempts=attempts,
        correct=correct,
        accuracy=round(accuracy, 4),
        avg_response_time_ms=round(avg_ms, 1),
        timeouts=row["timeouts"] or 0,
        difficulty=round(difficulty, 4),
        difficulty_label=_label(difficulty),
        reliable=attempts >= MIN_ATTEMPTS_FOR_RANKING,
        category=card.get("category"),
        type=card.get("type"),
        subject=card.get("subject"),
    )


def list_card_stats() -> list[CardStatsDetail]:
    """Cards ordenados do mais difícil ao mais fácil."""
    stats = [_build(r) for r in stats_repository.aggregate_all()]
    return sorted(stats, key=lambda s: s.difficulty, reverse=True)


def get_card_stats(card_id: str) -> Optional[CardStatsDetail]:
    row = stats_repository.aggregate_one(card_id)
    return _build(row) if row else None
