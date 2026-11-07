"""Regras de negócio dos cards."""
import random
from typing import Optional

from app.core.config import LOCAL_API_PREFIX, ROUND_TIME_LIMIT_MS
from app.db.database import get_connection
from app.repositories import cards_repository, stats_repository
from app.schemas.cards import CardPublic, GuessBody, GuessResult


class NoCardsError(Exception):
    pass


class AllCardsUsedError(Exception):
    pass


class CardNotFoundError(Exception):
    pass


def _clean_media_url(url: Optional[str]) -> str:
    if not url:
        return ""
    return url.removeprefix(LOCAL_API_PREFIX)


def get_next_card(exclude: Optional[str], media_type: str = "all") -> CardPublic:
    cards = cards_repository.list_cards(media_type)
    if not cards:
        raise NoCardsError(media_type)

    excluded_ids = set(exclude.split(",")) if exclude else set()
    available = [c for c in cards if str(c.get("id")) not in excluded_ids]
    if not available:
        raise AllCardsUsedError()

    card = random.choice(available)
    return CardPublic(
        id=str(card.get("id")),
        type=card["type"],
        imageUrl=_clean_media_url(card.get("imageUrl") or card.get("image_url")),
        videoUrl=_clean_media_url(card.get("videoUrl") or card.get("video_url")),
        textContent=card.get("textContent", ""),
        category=card.get("category", "geral"),
        prompt=card.get("prompt", "Prompt indisponível."),
    )


def evaluate_guess(card_id: str, body: GuessBody) -> GuessResult:
    card = cards_repository.find_card(card_id)
    if not card:
        raise CardNotFoundError(card_id)

    is_ai = bool(card.get("isAi", card.get("is_ai", False)))
    # Tempo esgotado conta sempre como erro, independentemente da escolha enviada.
    correct = not body.timed_out and (body.choice == "ai") == is_ai

    if body.participant_id:
        # Tempo registrado fica limitado ao tempo máximo da rodada.
        elapsed = ROUND_TIME_LIMIT_MS if body.timed_out else min(body.response_time_ms, ROUND_TIME_LIMIT_MS)
        with get_connection() as conn:
            stats_repository.insert_guess(
                conn, str(card_id), body.participant_id, body.choice, correct, body.timed_out, elapsed
            )

    return GuessResult(
        correct=correct,
        is_ai=is_ai,
        subject=card.get("subject", "Sem título"),
        explanation=card.get("explanation", "Sem descrição."),
    )
