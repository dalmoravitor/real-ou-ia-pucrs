import { useCallback, useEffect, useState } from "react";
import { fetchLeaderboard } from "../services/leaderboardApi";
import type { LeaderboardEntry } from "../types";

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setLeaderboard(await fetchLeaderboard());
    } catch {
      // backend pode estar iniciando
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { leaderboard, loading, refresh };
}
