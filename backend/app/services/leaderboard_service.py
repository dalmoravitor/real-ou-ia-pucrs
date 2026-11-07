"""Regras de negócio do ranking."""
import sqlite3

from app.db.database import get_connection
from app.repositories import leaderboard_repository as repo
from app.schemas.leaderboard import LeaderboardEntry


class InvalidEntryError(Exception):
    pass


class ParticipantMismatchError(Exception):
    pass


def get_ranking() -> list[dict]:
    return repo.list_best_entries()


def _unique_display_name(conn: sqlite3.Connection, base_name: str) -> str:
    candidate, suffix = base_name, 2
    while repo.name_exists(conn, candidate):
        candidate = f"{base_name} ({suffix})"
        suffix += 1
    return candidate


def save_score(entry: LeaderboardEntry) -> tuple[str, str]:
    """Cria ou atualiza a pontuação. Retorna (nome_exibido, participant_id)."""
    name = entry.name.strip()
    participant_id = entry.participant_id.strip()
    if not name:
        raise InvalidEntryError("Nome inválido.")
    if not participant_id:
        raise InvalidEntryError("Identificador do participante inválido.")

    with get_connection() as conn:
        existing_name = repo.find_name_by_participant(conn, participant_id)
        if existing_name and existing_name.strip().casefold() != name.casefold():
            raise ParticipantMismatchError()

        if entry.first_time or not existing_name:
            display_name = _unique_display_name(conn, name)
            repo.insert_entry(conn, display_name, participant_id, entry.score, entry.streak)
        else:
            display_name = existing_name
            repo.update_entry(conn, participant_id, entry.score, entry.streak)

    return display_name, participant_id
