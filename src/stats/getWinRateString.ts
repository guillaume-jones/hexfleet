import { calculateWr } from 'src/leaderboard/leaderboardUtils';

export const getWinRateString = (wins?: number, losses?: number): string => {
  if (wins === undefined || losses === undefined) {
    return '';
  }
  const winRate = calculateWr(wins, losses);
  return winRate ? winRate.toFixed(3).slice(winRate >= 0.9995 ? 0 : 1) : '';
};
