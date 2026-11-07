export type MediaType = "image" | "video" | "text";
export type ModeFilter = "all" | MediaType;
export type Choice = "real" | "ai";
export type ReportChoice = Choice | "timeout";
export type Phase = "start" | "playing" | "game_over";

export interface CardPublic {
  id: string;
  type?: MediaType;
  imageUrl?: string;
  videoUrl?: string;
  textContent?: string;
  category: string;
  prompt: string;
}

export interface GuessResult {
  correct: boolean;
  is_ai: boolean;
  subject: string;
  explanation: string;
}

export interface LeaderboardEntry {
  name: string;
  participant_id: string;
  score: number;
  streak: number;
}

export interface SavedScore {
  name: string;
  participant_id: string;
}

export interface RoundReport {
  card: CardPublic;
  choice: ReportChoice;
  result: GuessResult;
  speedBonus: number;
}

export interface CardStats {
  card_id: string;
  attempts: number;
  correct: number;
  accuracy: number;
  avg_response_time_ms: number;
  timeouts: number;
  difficulty: number;
  difficulty_label: "fácil" | "média" | "difícil";
  reliable: boolean;
  category?: string | null;
  type?: MediaType | null;
  subject?: string | null;
}
