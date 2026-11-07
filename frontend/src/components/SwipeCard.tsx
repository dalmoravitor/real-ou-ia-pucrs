import React, { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Film, FileText, Sparkles } from "lucide-react";
import type { CardPublic, Choice } from "../types";

interface Props {
  card: CardPublic;
  onSwipe: (direction: Choice) => void;
  disabled?: boolean;
  decision?: Choice | null;
}

export const SwipeCard: React.FC<Props> = ({ card, onSwipe, disabled, decision = null }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useMotionValue(1);
  const opacityReal = useTransform(x, [0, 18, 140], [0, 0.42, 1]);
  const opacityAi = useTransform(x, [-140, -18, 0], [1, 0.42, 0]);
  const scaleReal = useTransform(x, [0, 140], [0.9, 1]);
  const scaleAi = useTransform(x, [-140, 0], [1, 0.9]);

  const cardType = card.type || "image";

  useEffect(() => {
    const exitNudge = decision === "real" ? 72 : decision === "ai" ? -72 : 0;
    const target = decision ? x.get() + exitNudge : 0;
    const animation = animate(x, target, {
      duration: decision ? 1 : 0.22,
      ease: [0.4, 0, 0.2, 1],
    });
    const fadeAnimation = animate(opacity, decision ? 0 : 1, {
      duration: decision ? 1 : 0.22,
      ease: [0.4, 0, 0.2, 1],
    });
    return () => {
      animation.stop();
      fadeAnimation.stop();
    };
  }, [decision, opacity, x]);

  const handleDrag = (_: any, info: any) => {
    opacity.set(Math.max(0, 1 - Math.abs(info.offset.x) / 500));
  };

  const handleDragEnd = (_: any, info: any) => {
    if (disabled) return;
    if (info.offset.x > 120) {
      onSwipe("real");
    } else if (info.offset.x < -120) {
      onSwipe("ai");
    } else {
      animate(opacity, 1, {
        duration: 0.22,
        ease: [0.4, 0, 0.2, 1],
      });
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag={disabled ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      className="relative w-full h-full bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing border border-zinc-700/80 select-none flex items-center justify-center p-3"
    >
      {/* 1. MODO IMAGEM */}
      {cardType === "image" && card.imageUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-2xl scale-125 opacity-40 pointer-events-none"
            style={{ backgroundImage: `url(${card.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          <img
            src={card.imageUrl}
            alt="Desafio visual"
            className="relative z-10 max-w-full max-h-full object-contain p-2 rounded-2xl pointer-events-none drop-shadow-2xl"
          />
        </>
      )}

      {/* 2. MODO VÍDEO */}
      {cardType === "video" && card.videoUrl && (
        <div className="relative z-10 w-full h-full flex items-center justify-center rounded-2xl overflow-hidden bg-black/80">
          <video
            src={card.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="max-w-full max-h-full object-contain rounded-2xl pointer-events-none drop-shadow-2xl"
          />
        </div>
      )}

      {/* 3. MODO TEXTO */}
      {cardType === "text" && (
        <div className="relative z-10 w-full h-full p-6 sm:p-8 flex flex-col justify-center items-center bg-zinc-950/70 rounded-2xl border border-zinc-800">
          <FileText className="w-10 h-10 text-ai-400/60 mb-4" />
          <blockquote className="text-zinc-100 text-sm sm:text-base leading-relaxed text-center font-display font-medium max-w-md max-h-[22rem] overflow-y-auto px-2">
            “{card.textContent}”
          </blockquote>
        </div>
      )}

      {/* Moldura de scanner: cantos + linha de varredura */}
      {!decision && (
        <div className="scan-frame pointer-events-none absolute inset-3 z-20 rounded-2xl" aria-hidden="true">
          <i /><i /><i /><i />
          {cardType !== "text" && <span className="scan-line" />}
        </div>
      )}

      {/* Indicadores de swipe */}
      <motion.div
        style={{ opacity: opacityAi, scale: scaleAi }}
        className="absolute top-6 left-6 z-20 border-[3px] border-ai-500 text-ai-400 font-display font-extrabold px-4 py-1 rounded-xl text-2xl rotate-[-8deg] bg-zinc-950/90 backdrop-blur-md shadow-xl pointer-events-none"
      >
        IA
      </motion.div>
      <motion.div
        style={{ opacity: opacityReal, scale: scaleReal }}
        className="absolute top-6 right-6 z-20 border-[3px] border-real-500 text-real-400 font-display font-extrabold px-4 py-1 rounded-xl text-2xl rotate-[8deg] bg-zinc-950/90 backdrop-blur-md shadow-xl pointer-events-none"
      >
        REAL
      </motion.div>

      {/* Etiqueta da categoria e tipo de mídia */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
        <span className="text-xs font-semibold capitalize text-zinc-200 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-700/80 shadow-md flex items-center gap-1.5">
          {cardType === "video" ? (
            <Film className="w-3.5 h-3.5 text-sky-400" />
          ) : cardType === "text" ? (
            <FileText className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-ai-300" />
          )}
          {card.category}
        </span>
      </div>
    </motion.div>
  );
};