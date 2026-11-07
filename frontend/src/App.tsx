import React, { useState } from "react";
import { StatsPage } from "./components/screens/StatsPage";
import { useHashRoute } from "./hooks/useHashRoute";
import { GameOverScreen } from "./components/screens/GameOverScreen";
import { GameScreen } from "./components/screens/GameScreen";
import { StartScreen } from "./components/screens/StartScreen";
import { useGame } from "./hooks/useGame";
import type { FinalResult } from "./hooks/useGame";
import { useLeaderboard } from "./hooks/useLeaderboard";
import { savePlayerScore } from "./services/leaderboardApi";
import type { ModeFilter, Phase } from "./types";
import {
  createAnonymousParticipantId,
  normalizePlayerName,
  readParticipantIds,
  rememberParticipantId,
} from "./utils/participant";

export default function App() {
  const route = useHashRoute();
  const [phase, setPhase] = useState<Phase>("start");
  const [playerName, setPlayerName] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [mode, setMode] = useState<ModeFilter>("all");

  const { leaderboard, loading: loadingRanking, refresh: refreshLeaderboard } = useLeaderboard();

  const isKnownName = (name: string) =>
    leaderboard.some((entry) => normalizePlayerName(entry.name) === normalizePlayerName(name));

  const handleFinish = async ({ score, bestStreak }: FinalResult) => {
    try {
      const saved = await savePlayerScore(
        playerName.trim(),
        participantId.trim(),
        score,
        bestStreak,
        isFirstTime,
      );
      rememberParticipantId(playerName, saved.participant_id);
      rememberParticipantId(saved.name, saved.participant_id);
      setPlayerName(saved.name);
      await refreshLeaderboard();
    } catch (err) {
      console.error("Erro ao salvar pontuação:", err);
    }
    setPhase("game_over");
  };

  const game = useGame(participantId, handleFinish);

  const handlePlayerNameChange = (name: string) => {
    setPlayerName(name);
    setIsFirstTime(!name.trim() || !isKnownName(name));
    setRegistrationError(null);
  };

  const handleFirstTimeChange = (value: boolean) => {
    setIsFirstTime(value);
    setRegistrationError(null);
    if (value) setParticipantId("");
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    const normalized = normalizePlayerName(playerName);
    if (!isKnownName(playerName) && !isFirstTime) {
      setRegistrationError(
        "Ainda não encontramos esse nome no ranking. Marque “É minha primeira vez jogando” para começar.",
      );
      return;
    }
    setRegistrationError(null);

    const knownEntry = leaderboard.find(
      (entry) => normalizePlayerName(entry.name) === normalized && entry.participant_id,
    );
    const resolvedId = isFirstTime
      ? createAnonymousParticipantId()
      : knownEntry?.participant_id || readParticipantIds()[normalized] || createAnonymousParticipantId();

    rememberParticipantId(playerName, resolvedId);
    setParticipantId(resolvedId);
    setPhase("playing");
    game.start(mode);
  };

  const handleResetToStart = () => {
    setPlayerName("");
    setParticipantId("");
    setIsFirstTime(true);
    setPhase("start");
    void refreshLeaderboard();
  };

  if (route === "/estatisticas") return <StatsPage />;

  return (
    <div className="app-shell flex flex-col min-h-screen max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 justify-between select-none">
      {phase === "start" && (
        <StartScreen
          playerName={playerName}
          onPlayerNameChange={handlePlayerNameChange}
          isFirstTime={isFirstTime}
          onFirstTimeChange={handleFirstTimeChange}
          knownPlayerName={isKnownName(playerName)}
          mode={mode}
          onModeChange={setMode}
          registrationError={registrationError}
          onSubmit={handleStart}
          leaderboard={leaderboard}
          loadingRanking={loadingRanking}
          onRefreshRanking={refreshLeaderboard}
        />
      )}

      {phase === "playing" && (
        <GameScreen
          playerName={playerName}
          score={game.score}
          streak={game.streak}
          round={game.round}
          timeLeft={game.timeLeft}
          currentCard={game.currentCard}
          loadingCard={game.loadingCard}
          submitting={game.submitting}
          selectedChoice={game.selectedChoice}
          apiError={game.apiError}
          onChoice={(choice) => void game.choose(choice)}
          onRetry={game.retry}
        />
      )}

      {phase === "game_over" && (
        <GameOverScreen
          playerName={playerName}
          participantId={participantId}
          score={game.score}
          bestStreak={game.bestStreak}
          reports={game.reports}
          leaderboard={leaderboard}
          onReset={handleResetToStart}
        />
      )}
    </div>
  );
}
