import { Trophy, RefreshCw } from "lucide-react";
import type { LeaderboardEntry } from "../types";

interface HeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function StartLeaderboard({
  entries,
  loading,
  onRefresh,
}: HeaderProps & { entries: LeaderboardEntry[] }) {
  return (
    <div className="start-leaderboard w-full bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-bold text-zinc-300">
        <span className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-real-400" /> Ranking completo
        </span>
        <button onClick={onRefresh} title="Atualizar" className="text-zinc-500 hover:text-zinc-300">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      <div className="leaderboard-scroll divide-y divide-zinc-800/50">
        {entries.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-3">Nenhum jogador registrado ainda.</p>
        ) : (
          entries.map((entry, index) => (
            <div key={`${entry.participant_id}-${index}`} className="flex justify-between items-center py-2 text-xs">
              <span className="text-zinc-300 font-medium">
                <strong className="text-zinc-500 mr-2">#{index + 1}</strong>
                {entry.name}
              </span>
              <span className="font-mono text-zinc-100 font-bold">{entry.score.toLocaleString("pt-BR")} pts</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function ResultsLeaderboard({
  entries,
  playerName,
  participantId,
}: {
  entries: LeaderboardEntry[];
  playerName: string;
  participantId: string;
}) {
  return (
    <section className="report-panel border border-zinc-800 rounded-2xl bg-zinc-950/60 overflow-hidden text-left">
      <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800 flex justify-between text-xs font-bold text-zinc-400">
        <span>Leaderboard da Semana</span>
        <span>Pontos</span>
      </div>
      <div className="leaderboard-scroll divide-y divide-zinc-800/40">
        {entries.map((item, idx) => (
          <div
            key={`${item.participant_id}-${idx}`}
            className={`flex items-center justify-between px-4 py-2.5 text-xs ${
              item.name === playerName.trim() && item.participant_id === participantId.trim()
                ? "bg-real-500/10 text-real-300 font-bold"
                : "text-zinc-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-zinc-500 font-mono w-4">#{idx + 1}</span>
              {item.name}
            </span>
            <span className="font-mono text-zinc-100">{item.score.toLocaleString("pt-BR")}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
