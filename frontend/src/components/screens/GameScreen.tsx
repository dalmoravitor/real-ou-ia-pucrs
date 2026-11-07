import { AlertCircle, Clock, Eye, Flame, RefreshCw, Terminal, Trophy } from "lucide-react";
import { TOTAL_ROUNDS } from "../../config/game";
import type { CardPublic, Choice } from "../../types";
import { SwipeCard } from "../SwipeCard";

interface Props {
  playerName: string;
  score: number;
  streak: number;
  round: number;
  timeLeft: number;
  currentCard: CardPublic | null;
  loadingCard: boolean;
  submitting: boolean;
  selectedChoice: Choice | null;
  apiError: string | null;
  onChoice: (choice: Choice) => void;
  onRetry: () => void;
}

export function GameScreen(p: Props) {
  return (
    <>
      <header className="game-header flex items-center justify-between bg-zinc-900/70 border border-zinc-800 px-5 py-3 rounded-2xl backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-real-400" />
          <span className="text-sm font-bold text-zinc-100">{p.score.toLocaleString("pt-BR")} pts</span>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-zinc-800/60 rounded-full text-zinc-300 border border-zinc-700/50">
          {p.playerName} • {p.round} de {TOTAL_ROUNDS}
        </span>
        <div className={`flex items-center gap-1.5 text-xs font-bold font-mono ${p.timeLeft <= 5 ? "text-rose-400" : "text-ai-300"}`}>
          <Clock className="w-4 h-4" />
          <span>{p.timeLeft}s</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame className={`w-4 h-4 ${p.streak > 0 ? "text-real-400 fill-real-400" : "text-zinc-600"}`} />
          <span className="text-xs font-bold text-real-400 font-mono">{p.streak}x</span>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center my-4">
        {p.apiError ? (
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-6 text-center max-w-md">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-rose-200">Falha de Comunicação</h3>
            <p className="text-xs text-rose-300 mt-1 leading-relaxed">{p.apiError}</p>
            <button
              onClick={p.onRetry}
              className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition"
            >
              Tentar Novamente
            </button>
          </div>
        ) : p.loadingCard ? (
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 text-zinc-500 animate-spin" />
            <span className="text-xs text-zinc-500 font-medium">Carregando desafio...</span>
          </div>
        ) : p.currentCard ? (
          <div className="game-layout w-full">
            <div className="card-column relative w-full">
              <SwipeCard card={p.currentCard} onSwipe={p.onChoice} disabled={p.submitting} decision={p.selectedChoice} />
            </div>

            <div className="game-info flex flex-col justify-center text-left">
              <h1 className="mt-3 text-xl sm:text-2xl font-display font-extrabold tracking-tight text-white">É real ou IA?</h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
                Analise os detalhes, leia o possível prompt e descubra se o conteúdo é autêntico ou gerado por inteligência artificial.
              </p>

              <div className="prompt-panel mt-8 w-full rounded-2xl bg-zinc-900/70 border border-zinc-800 p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 text-zinc-200">
                    <Terminal className="w-4 h-4 text-ai-300" />
                    <span className="text-sm font-semibold">Possível prompt</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">Análise #{p.round.toString().padStart(2, "0")}</span>
                </div>
                <p className="text-sm leading-6 text-zinc-300">{p.currentCard.prompt}</p>
                <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-[11px] text-zinc-500">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Observe textura, consistência temporal, física e linguagem.</span>
                </div>
              </div>

              <div className="game-actions mt-8 flex items-center gap-4">
                <button
                  onClick={() => p.onChoice("ai")}
                  disabled={p.submitting || p.loadingCard}
                  className="flex flex-1 flex-col items-center justify-center h-16 rounded-2xl bg-ai-500/[0.07] border border-ai-500/30 hover:border-ai-500 hover:bg-ai-500/15 text-zinc-300 hover:text-ai-300 transition active:scale-95 disabled:opacity-30 shadow-md group"
                >
                  <span className="text-base font-bold">IA</span>
                  <span className="text-[9px] font-mono text-zinc-500 group-hover:text-ai-300">[ ← ]</span>
                </button>
                <button
                  onClick={() => p.onChoice("real")}
                  disabled={p.submitting || p.loadingCard}
                  className="flex flex-1 flex-col items-center justify-center h-16 rounded-2xl bg-real-500/[0.07] border border-real-500/30 hover:border-real-500 hover:bg-real-500/15 text-zinc-300 hover:text-real-300 transition active:scale-95 disabled:opacity-30 shadow-md group"
                >
                  <span className="text-base font-bold">Real</span>
                  <span className="text-[9px] font-mono text-zinc-500 group-hover:text-real-300">[ → ]</span>
                </button>
              </div>
              <span className="mt-3 text-[11px] text-zinc-500">Arraste o card ou escolha uma das respostas</span>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}
