from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.schemas.cards import CardPublic, GuessBody, GuessResult
from app.services import cards_service
from app.services.cards_service import AllCardsUsedError, CardNotFoundError, NoCardsError

router = APIRouter(prefix="/api/cards", tags=["cards"])


@router.get("/next", response_model=CardPublic)
def get_next_card(
    exclude: Optional[str] = Query(None),
    media_type: Optional[str] = Query("all"),
):
    """Retorna um card aleatório do tipo escolhido, evitando os já jogados."""
    media_type = media_type or "all"
    try:
        return cards_service.get_next_card(exclude, media_type)
    except NoCardsError:
        raise HTTPException(404, f"Nenhum card cadastrado para a categoria '{media_type}'.")
    except AllCardsUsedError:
        raise HTTPException(409, "Todos os cards já foram usados nesta sessão.")


@router.post("/{card_id}/guess", response_model=GuessResult)
def submit_guess(card_id: str, body: GuessBody):
    try:
        return cards_service.evaluate_guess(card_id, body)
    except CardNotFoundError:
        raise HTTPException(404, "Card não encontrado")
