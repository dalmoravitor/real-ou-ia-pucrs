from pydantic import BaseModel, Field


class LeaderboardEntry(BaseModel):
    name: str = Field(..., min_length=2, max_length=20)
    participant_id: str = Field(..., min_length=2, max_length=30)
    score: int = Field(..., ge=0)
    streak: int = Field(..., ge=0)
    first_time: bool = False


class LeaderboardRow(BaseModel):
    name: str
    participant_id: str
    score: int
    streak: int


class SaveScoreResponse(BaseModel):
    status: str
    message: str
    name: str
    participant_id: str
