import type { LeaderboardEntry, SavedScore } from "../types";
import { postJson, request } from "./http";

export const fetchLeaderboard = () =>
  request<LeaderboardEntry[]>("/api/leaderboard", "Erro ao carregar ranking.");

export const savePlayerScore = (
  name: string,
  participantId: string,
  score: number,
  streak: number,
  firstTime: boolean,
) =>
  postJson<SavedScore>(
    "/api/leaderboard",
    { name, participant_id: participantId, score, streak, first_time: firstTime },
    "Erro ao salvar pontuação no leaderboard.",
  );
