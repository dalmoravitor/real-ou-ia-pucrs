import { motion } from "framer-motion";
import { BarChart3, Play, User } from "lucide-react";
import { GAME_MODES } from "../../config/game";
import type { LeaderboardEntry, ModeFilter } from "../../types";
import { StartLeaderboard } from "../LeaderboardList";

interface Props {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  isFirstTime: boolean;
  onFirstTimeChange: (value: boolean) => void;
  knownPlayerName: boolean;
  mode: ModeFilter;
  onModeChange: (mode: ModeFilter) => void;
  registrationError: string | null;
  onSubmit: (e: React.FormEvent) => void;
  leaderboard: LeaderboardEntry[];
  loadingRanking: boolean;
  onRefreshRanking: () => void;
}

export function StartScreen(p: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="start-screen flex-1 flex flex-col items-center justify-center gap-6"
    >
      <div className="start-layout w-full">
        <div className="start-primary flex flex-col items-center lg:items-start">
          <div className="start-copy text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/70 border border-zinc-700/70 rounded-full text-xs font-medium text-zinc-300 mb-5">
              <span className="live-dot" /> Semana Acadêmica de IA · PUCRS
            </span>
            <h1 className="brand-title font-display">Real ou IA?</h1>
            <p className="text-lg text-zinc-400 mt-2 max-w-md mx-auto lg:mx-0">
              Teste seu olhar contra modelos generativos modernos. Faça 10 escolhas e dispute o topo do ranking.
            </p>
          </div>

          <form
            onSubmit={p.onSubmit}
            className="start-form mt-8 w-full max-w-sm flex flex-col gap-3 bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800 shadow-xl backdrop-blur-md"
          >
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" /> Como podemos chamar você?
            </label>
            <input
              type="text"
              required
              maxLength={20}
              value={p.playerName}
              onChange={(e) => p.onPlayerNameChange(e.target.value)}
              placeholder="Ex: João da Silva"
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-400 transition"
              autoFocus
            />

            <div className="flex flex-col gap-1.5 mt-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Modo do Desafio
              </label>
              <div className="grid grid-cols-4 gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                {GAME_MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => p.onModeChange(m.id)}
                    className={`py-1.5 text-xs font-medium rounded-lg transition ${
                      p.mode === m.id
                        ? "bg-zinc-800 text-white font-bold shadow-sm"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-2 mt-1 text-xs text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={p.isFirstTime}
                onChange={(e) => p.onFirstTimeChange(e.target.checked)}
                className="mt-0.5 accent-ai-500"
              />
              <span>
                <strong className="font-semibold text-zinc-200">É minha primeira vez jogando</strong>
                <span className="block mt-1 text-[11px] leading-4 text-zinc-500">
                  {p.knownPlayerName
                    ? "Desmarque para continuar de onde você parou."
                    : "Vamos criar seu histórico automaticamente, sem pedir matrícula."}
                </span>
              </span>
            </label>

            {p.registrationError && (
              <p className="text-xs leading-4 text-rose-300 bg-rose-950/40 border border-rose-900/70 rounded-xl px-3 py-2">
                {p.registrationError}
              </p>
            )}

            <button
              type="submit"
              disabled={!p.playerName.trim()}
              className="btn-primary w-full py-3 text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 fill-current" /> Iniciar Desafio
            </button>
          </form>

          <a
            href="#/estatisticas"
            className="mt-3 w-full max-w-sm py-2.5 border border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 text-zinc-300 hover:text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <BarChart3 className="w-4 h-4" /> Ver estatísticas dos desafios
          </a>
        </div>

        <StartLeaderboard entries={p.leaderboard} loading={p.loadingRanking} onRefresh={p.onRefreshRanking} />
      </div>
    </motion.div>
  );
}
