import { useCallback, useEffect, useState } from "react";
import { fetchCardStats } from "../services/statsApi";
import type { CardStats } from "../types";

export function useCardStats() {
  const [stats, setStats] = useState<CardStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStats(await fetchCardStats());
    } catch {
      setError("Não foi possível carregar as estatísticas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { stats, loading, error, refresh };
}
