"""Persistência do ranking em SQLite."""
import sqlite3
from typing import List, Optional

from app.db.database import get_connection


def list_best_entries() -> List[dict]:
    """Melhor entrada de cada participante, ordenada por pontos e streak."""
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT name, participant_id, score, streak
            FROM leaderboard AS current
            WHERE participant_id = ''
               OR id = (
                    SELECT candidate.id
                    FROM leaderboard AS candidate
                    WHERE candidate.participant_id = current.participant_id
                    ORDER BY candidate.score DESC, candidate.streak DESC, candidate.id ASC
                    LIMIT 1
               )
            ORDER BY score DESC, streak DESC, id ASC
            """
        ).fetchall()
    return [dict(row) for row in rows]


def find_name_by_participant(conn: sqlite3.Connection, participant_id: str) -> Optional[str]:
    row = conn.execute(
        "SELECT name FROM leaderboard WHERE participant_id = ? ORDER BY id ASC LIMIT 1",
        (participant_id,),
    ).fetchone()
    return row["name"] if row else None


def name_exists(conn: sqlite3.Connection, name: str) -> bool:
    return conn.execute(
        "SELECT 1 FROM leaderboard WHERE LOWER(name) = LOWER(?) LIMIT 1", (name,)
    ).fetchone() is not None


def insert_entry(conn: sqlite3.Connection, name: str, participant_id: str, score: int, streak: int) -> None:
    conn.execute(
        "INSERT INTO leaderboard (name, participant_id, score, streak) VALUES (?, ?, ?, ?)",
        (name, participant_id, score, streak),
    )


def update_entry(conn: sqlite3.Connection, participant_id: str, score: int, streak: int) -> None:
    conn.execute(
        "UPDATE leaderboard SET score = ?, streak = ? WHERE participant_id = ?",
        (score, streak, participant_id),
    )
