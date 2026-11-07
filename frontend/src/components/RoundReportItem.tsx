import { Check, FileText, Film, X } from "lucide-react";
import type { RoundReport } from "../types";

const CHOICE_LABEL = { timeout: "Tempo esgotado", ai: "IA", real: "Real" } as const;

export function RoundReportItem({ item, index }: { item: RoundReport; index: number }) {
  const { card, result, choice, speedBonus } = item;
  return (
    <article className="p-4">
      <div className="flex items-start gap-3">
        {card.type === "image" && card.imageUrl ? (
          <img src={card.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover border border-zinc-700 shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
            {card.type === "video" ? (
              <Film className="w-6 h-6 text-sky-400" />
            ) : (
              <FileText className="w-6 h-6 text-amber-400" />
            )}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-zinc-500">ITEM {String(index + 1).padStart(2, "0")}</span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${result.correct ? "text-emerald-400" : "text-rose-400"}`}>
              {result.correct ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              {result.correct ? "Acerto" : "Erro"}
            </span>
          </div>
          <p className="text-xs text-zinc-200 mt-1 truncate">{result.subject}</p>
          <p className="text-[11px] text-zinc-500 mt-1">
            Você: {CHOICE_LABEL[choice]} · Gabarito: {result.is_ai ? "IA" : "Real"}
            {speedBonus > 0 && ` · +${speedBonus} velocidade`}
          </p>
        </div>
      </div>
      <p className="text-xs leading-5 text-zinc-400 mt-3">{result.explanation}</p>
    </article>
  );
}
