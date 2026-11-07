from fastapi import APIRouter, HTTPException

from app.schemas.leaderboard import LeaderboardEntry, LeaderboardRow, SaveScoreResponse
from app.services import leaderboard_service
from app.services.leaderboard_service import InvalidEntryError, ParticipantMismatchError

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])


@router.get("", response_model=list[LeaderboardRow])
def get_leaderboard():
    """Ranking ordenado por pontuação e streak."""
    return leaderboard_service.get_ranking()


@router.post("", response_model=SaveScoreResponse)
def save_score(entry: LeaderboardEntry):
    """Cria uma entrada nova ou atualiza a pontuação do participante."""
    try:
        name, participant_id = leaderboard_service.save_score(entry)
    except InvalidEntryError as e:
        raise HTTPException(400, str(e))
    except ParticipantMismatchError:
        raise HTTPException(409, "O identificador do participante não corresponde ao nome informado.")
    return SaveScoreResponse(
        status="success",
        message="Pontuação salva com sucesso!",
        name=name,
        participant_id=participant_id,
    )
