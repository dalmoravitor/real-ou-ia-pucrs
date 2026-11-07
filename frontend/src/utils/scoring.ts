import {
  BASE_POINTS,
  SPEED_BONUS_PER_SECOND,
  STREAK_BONUS_BASE,
  STREAK_BONUS_MULTIPLIER,
} from "../config/game";

export const getStreakBonus = (streak: number) =>
  streak === 0 ? 0 : Math.round(STREAK_BONUS_BASE * STREAK_BONUS_MULTIPLIER ** (streak - 1));

export const getSpeedBonus = (timeLeft: number) => timeLeft * SPEED_BONUS_PER_SECOND;

export const getRoundPoints = (streakBefore: number, speedBonus: number) =>
  BASE_POINTS + getStreakBonus(streakBefore) + speedBonus;
