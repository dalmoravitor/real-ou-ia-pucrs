import { API_BASE_URL } from "../config/game";
import type { CardPublic, Choice, GuessResult, ModeFilter } from "../types";
import { postJson, request } from "./http";

const absolutize = (url?: string) => (url && url.startsWith("/") ? `${API_BASE_URL}${url}` : url);

export async function fetchNextCard(excludedIds: string[] = [], mode: ModeFilter = "all"): Promise<CardPublic> {
  const params = new URLSearchParams();
  const unique = [...new Set(excludedIds)];
  if (unique.length > 0) params.append("exclude", unique.join(","));
  if (mode !== "all") params.append("media_type", mode);

  const query = params.toString() ? `?${params}` : "";
  const card = await request<CardPublic>(`/api/cards/next${query}`, "Erro ao obter o próximo desafio.");
  return { ...card, imageUrl: absolutize(card.imageUrl), videoUrl: absolutize(card.videoUrl) };
}

export interface GuessPayload {
  choice: Choice;
  participantId: string;
  responseTimeMs: number;
  timedOut: boolean;
}

export const submitGuess = (cardId: string, { choice, participantId, responseTimeMs, timedOut }: GuessPayload) =>
  postJson<GuessResult>(
    `/api/cards/${cardId}/guess`,
    { choice, participant_id: participantId || null, response_time_ms: responseTimeMs, timed_out: timedOut },
    "Erro ao validar o palpite.",
  );
