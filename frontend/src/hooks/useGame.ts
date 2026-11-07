import { useCallback, useEffect, useRef, useState } from "react";
import { REVEAL_DELAY_MS, TIME_LIMIT_SECONDS, TOTAL_ROUNDS } from "../config/game";
import { fetchNextCard, submitGuess } from "../services/cardsApi";
import type { CardPublic, Choice, ModeFilter, ReportChoice, RoundReport } from "../types";
import { getRoundPoints, getSpeedBonus } from "../utils/scoring";

export interface FinalResult {
  score: number;
  bestStreak: number;
}

/**
 * Controla uma partida: carregamento de cards, palpites, placar, timer e atalhos de teclado.
 * `onFinish` é chamado após a última rodada (ex.: para salvar no ranking).
 */
export function useGame(participantId: string, onFinish: (result: FinalResult) => Promise<void> | void) {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<ModeFilter>("all");
  const [currentCard, setCurrentCard] = useState<CardPublic | null>(null);
  const [playedIds, setPlayedIds] = useState<string[]>([]);
  const [loadingCard, setLoadingCard] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [reports, setReports] = useState<RoundReport[]>([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const roundStartedAt = useRef<number>(performance.now());

  const loadNext = useCallback(async (excluded: string[], nextMode: ModeFilter) => {
    setLoadingCard(true);
    setApiError(null);
    setSelectedChoice(null);
    try {
      const card = await fetchNextCard(excluded, nextMode);
      setCurrentCard(card);
      setPlayedIds((prev) => [...prev, card.id]);
    } catch {
      setApiError(
        "Não foi possível carregar o desafio. Verifique se o backend está ativo e se há cards cadastrados para o modo escolhido.",
      );
    } finally {
      setLoadingCard(false);
    }
  }, []);

  const start = useCallback(
    (selectedMode: ModeFilter) => {
      setMode(selectedMode);
      setScore(0);
      setStreak(0);
      setBestStreak(0);
      setRound(1);
      setPlayedIds([]);
      setReports([]);
      setActive(true);
      void loadNext([], selectedMode);
    },
    [loadNext],
  );

  const choose = async (choice: Choice, reportChoice: ReportChoice = choice) => {
    if (!currentCard || submitting || selectedChoice || !active) return;
    setSelectedChoice(choice);
    setSubmitting(true);

    try {
      const timedOut = reportChoice === "timeout";
      const responseTimeMs = Math.round(performance.now() - roundStartedAt.current);
      const raw = await submitGuess(currentCard.id, { choice, participantId, responseTimeMs, timedOut });
      const result = reportChoice === "timeout" ? { ...raw, correct: false } : raw;
      const speedBonus = result.correct ? getSpeedBonus(timeLeft) : 0;
      setReports((prev) => [...prev, { card: currentCard, choice: reportChoice, result, speedBonus }]);

      const nextStreak = result.correct ? streak + 1 : 0;
      const nextBest = Math.max(bestStreak, nextStreak);
      const nextScore = result.correct ? score + getRoundPoints(streak, speedBonus) : score;
      setScore(nextScore);
      setStreak(nextStreak);
      setBestStreak(nextBest);

      await new Promise((r) => setTimeout(r, REVEAL_DELAY_MS));

      if (round >= TOTAL_ROUNDS) {
        setActive(false);
        await onFinish({ score: nextScore, bestStreak: nextBest });
      } else {
        setRound((prev) => prev + 1);
        await loadNext([...playedIds, currentCard.id], mode);
      }
    } catch {
      setApiError("Erro ao enviar palpite ao servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  // Sempre aponta para a versão mais recente de `choose` (evita closures obsoletas em timers/teclado).
  const chooseRef = useRef(choose);
  useEffect(() => {
    chooseRef.current = choose;
  });

  // Cronômetro da rodada
  useEffect(() => {
    if (!active || !currentCard || loadingCard || submitting || selectedChoice) return;

    setTimeLeft(TIME_LIMIT_SECONDS);
    roundStartedAt.current = performance.now();
    const intervalId = window.setInterval(() => setTimeLeft((t) => Math.max(t - 1, 0)), 1000);
    const timeoutId = window.setTimeout(() => void chooseRef.current("real", "timeout"), TIME_LIMIT_SECONDS * 1000);
    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [currentCard?.id, active, loadingCard, submitting, selectedChoice]);

  // Atalhos de teclado (setas ou A/D)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!active || submitting || selectedChoice) return;
      const key = e.key.toLowerCase();
      if (e.key === "ArrowLeft" || key === "a") void chooseRef.current("ai");
      else if (e.key === "ArrowRight" || key === "d") void chooseRef.current("real");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, submitting, selectedChoice]);

  return {
    mode,
    currentCard,
    loadingCard,
    apiError,
    submitting,
    selectedChoice,
    timeLeft,
    reports,
    round,
    score,
    streak,
    bestStreak,
    start,
    choose,
    retry: () => loadNext(playedIds, mode),
  };
}
