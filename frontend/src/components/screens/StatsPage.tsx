import { ArrowLeft, RefreshCw } from "lucide-react";
import { useCardStats } from "../../hooks/useCardStats";
import type { CardStats } from "../../types";

const LABEL_STYLE: Record<CardStats["difficulty_label"], string> = {
  fácil: "text-emerald-400",
  média: "text-amber-400",
  difícil: "text-rose-400",
};

export function StatsPage() {
  const { stats, loading, error, refresh } = useCardStats();

  return (
    <div className="app-shell max-w-5xl mx-auto px-4 py-6 sm:px-6">
      <header className="flex items-center justify-between mb-6">
        <a href="#/" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200">
          <ArrowLeft className="w-4 h-4" /> Voltar ao jogo
        </a>
        <button onClick={refresh} title="Atualizar" className="text-zinc-500 hover:text-zinc-300">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </header>

      <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Estatísticas dos desafios</h1>
      <p className="text-sm text-zinc-400 mt-1 mb-6">
        Dificuldade calculada pela taxa de acerto (70%) e pelo tempo médio de resposta (30%).
      </p>

      {error && <p className="text-sm text-rose-300">{error}</p>}
      {!loading && !error && stats.length === 0 && (
        <p className="text-sm text-zinc-500">Ainda não há respostas registradas.</p>
      )}

      {stats.length > 0 && (
        <div className="glass overflow-x-auto rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="text-zinc-400 bg-zinc-900/90">
              <tr>
                <th className="px-4 py-3">Desafio</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3 text-right">Respostas</th>
                <th className="px-4 py-3 text-right">Acerto</th>
                <th className="px-4 py-3 text-right">Tempo médio</th>
                <th className="px-4 py-3">Dificuldade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {stats.map((s) => (
                <tr key={s.card_id} className={s.reliable ? "" : "opacity-60"}>
                  <td className="px-4 py-3 text-zinc-200">
                    {s.subject || s.card_id}
                    <span className="block text-[10px] font-mono text-zinc-500">{s.card_id}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{s.type ?? "-"}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {s.attempts}
                    {!s.reliable && <span title="Poucas respostas"> *</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{Math.round(s.accuracy * 100)}%</td>
                  <td className="px-4 py-3 text-right font-mono">{(s.avg_response_time_ms / 1000).toFixed(1)}s</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-ai-500 to-real-500" style={{ width: `${Math.round(s.difficulty * 100)}%` }} />
                      </div>
                      <span className={`font-bold ${LABEL_STYLE[s.difficulty_label]}`}>{s.difficulty_label}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-[11px] text-zinc-500 mt-3">* Menos de 5 respostas: amostra pouco confiável.</p>
    </div>
  );
}
