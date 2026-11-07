import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { TOTAL_ROUNDS } from "../../config/game";
import type { LeaderboardEntry, RoundReport } from "../../types";
import { ResultsLeaderboard } from "../LeaderboardList";
import { RoundReportItem } from "../RoundReportItem";

interface Props {
  playerName: string;
  participantId: string;
  score: number;
  bestStreak: number;
  reports: RoundReport[];
  leaderboard: LeaderboardEntry[];
  onReset: () => void;
}

export function GameOverScreen(p: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="results-shell flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto w-full"
    >
      <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-real-500/10 text-real-400 border border-real-500/25 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Desafio Concluído!
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">Parabéns, {p.playerName}!</h2>
        <p className="text-5xl font-display font-extrabold text-real-400 mt-3 tabular-nums">
          {p.score.toLocaleString("pt-BR")} <span className="text-sm font-normal text-zinc-400">pontos</span>
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          Maior sequência: <strong className="text-zinc-200">{p.bestStreak} acertos seguidos</strong>
        </p>

        <div className="report-grid mt-8 text-left">
          <section className="report-panel border border-zinc-800 rounded-2xl bg-zinc-900/75 overflow-hidden">
            <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-300">Seu relatório</p>
                <p className="text-[11px] text-zinc-500 mt-1">O gabarito completo das suas escolhas</p>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                {p.reports.length}/{TOTAL_ROUNDS}
              </span>
            </div>
            <div className="divide-y divide-zinc-800/60 max-h-[29rem] overflow-y-auto">
              {p.reports.map((item, idx) => (
                <RoundReportItem key={`${item.card.id}-${idx}`} item={item} index={idx} />
              ))}
            </div>
          </section>

          <ResultsLeaderboard entries={p.leaderboard} playerName={p.playerName} participantId={p.participantId} />
        </div>

        <button
          onClick={p.onReset}
          className="btn-primary mt-6 w-full py-3.5 text-sm rounded-xl flex items-center justify-center gap-2"
        >
          Próximo Jogador <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
