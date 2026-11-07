import type { ModeFilter } from "../types";

export const TOTAL_ROUNDS = 10;
export const TIME_LIMIT_SECONDS = 15;
export const SPEED_BONUS_PER_SECOND = 5;
export const BASE_POINTS = 100;
export const STREAK_BONUS_BASE = 25;
export const STREAK_BONUS_MULTIPLIER = 1.4;
export const REVEAL_DELAY_MS = 1200;

export const GAME_MODES: { id: ModeFilter; label: string }[] = [
  { id: "all", label: "Misto" },
  { id: "image", label: "Imagens" },
  { id: "video", label: "Vídeos" },
  { id: "text", label: "Textos" },
];

const DEFAULT_API_URL = import.meta.env.PROD
  ? "https://semana-academica-api.onrender.com"
  : "http://localhost:8000";

export const API_BASE_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, "");
