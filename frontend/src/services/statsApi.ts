import type { CardStats } from "../types";
import { request } from "./http";

export const fetchCardStats = () =>
  request<CardStats[]>("/api/stats/cards", "Erro ao carregar estatísticas.");
