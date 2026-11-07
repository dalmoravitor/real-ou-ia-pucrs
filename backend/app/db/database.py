"""Acesso ao SQLite e criação do schema."""
import sqlite3
from contextlib import contextmanager
from typing import Iterator

from app.core.config import DB_PATH


@contextmanager
def get_connection() -> Iterator[sqlite3.Connection]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        with conn:  # commit/rollback automático
            yield conn
    finally:
        conn.close()


def init_db() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS leaderboard (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                participant_id TEXT NOT NULL DEFAULT '',
                score INTEGER NOT NULL,
                streak INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        columns = {row["name"] for row in conn.execute("PRAGMA table_info(leaderboard)")}
        if "participant_id" not in columns:
            conn.execute(
                "ALTER TABLE leaderboard ADD COLUMN participant_id TEXT NOT NULL DEFAULT ''"
            )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS guesses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                card_id TEXT NOT NULL,
                participant_id TEXT NOT NULL,
                choice TEXT NOT NULL,
                correct INTEGER NOT NULL,
                timed_out INTEGER NOT NULL DEFAULT 0,
                response_time_ms INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_guesses_card ON guesses(card_id)")
