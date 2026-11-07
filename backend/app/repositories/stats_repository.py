"""Persistência e agregação das respostas dos jogadores."""
import sqlite3
from typing import List, Optional

from app.db.database import get_connection

_AGG = """
    SELECT card_id,
           COUNT(*) AS attempts,
           SUM(correct) AS correct,
           SUM(timed_out) AS timeouts,
           AVG(response_time_ms) AS avg_response_time_ms
    FROM guesses
"""


def insert_guess(
    conn: sqlite3.Connection,
    card_id: str,
    participant_id: str,
    choice: str,
    correct: bool,
    timed_out: bool,
    response_time_ms: int,
) -> None:
    conn.execute(
        """
        INSERT INTO guesses (card_id, participant_id, choice, correct, timed_out, response_time_ms)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (card_id, participant_id, choice, int(correct), int(timed_out), response_time_ms),
    )


def aggregate_all() -> List[dict]:
    with get_connection() as conn:
        return [dict(r) for r in conn.execute(_AGG + " GROUP BY card_id").fetchall()]


def aggregate_one(card_id: str) -> Optional[dict]:
    with get_connection() as conn:
        row = conn.execute(_AGG + " WHERE card_id = ? GROUP BY card_id", (card_id,)).fetchone()
    return dict(row) if row else None
