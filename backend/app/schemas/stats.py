from typing import Optional

from pydantic import BaseModel


class CardStats(BaseModel):
    card_id: str
    attempts: int
    correct: int
    accuracy: float  # 0..1
    avg_response_time_ms: float
    timeouts: int
    difficulty: float  # 0..1 (maior = mais difícil)
    difficulty_label: str
    reliable: bool  # amostra suficiente para confiar na métrica


class CardStatsDetail(CardStats):
    category: Optional[str] = None
    type: Optional[str] = None
    subject: Optional[str] = None
