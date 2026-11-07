from typing import Literal

from typing import Optional

from pydantic import BaseModel, Field

MediaType = Literal["image", "video", "text"]


class CardPublic(BaseModel):
    """Card exposto ao cliente — nunca inclui o gabarito."""

    id: str
    type: MediaType
    imageUrl: str = ""
    videoUrl: str = ""
    textContent: str = ""
    category: str = "geral"
    prompt: str = "Prompt indisponível."


class GuessBody(BaseModel):
    choice: Literal["real", "ai"]
    participant_id: Optional[str] = Field(None, min_length=2, max_length=30)
    response_time_ms: int = Field(0, ge=0, le=60_000)
    timed_out: bool = False


class GuessResult(BaseModel):
    correct: bool
    is_ai: bool
    subject: str
    explanation: str
