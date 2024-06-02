import { GameOutcome } from 'functions/src/document-types/Score';

export const getMostGamesInADay = (games: GameOutcome[]): number => {
  let mostGames = 0;
  let current = 0;
  let currentDate = new Date();

  for (const game of games) {
    const gameDate = game.timestamp?.toDate();

    if (!gameDate) continue;

    gameDate.setHours(0, 0, 0, 0);

    if (gameDate.getTime() !== currentDate.getTime()) {
      current = 0;
      currentDate = gameDate;
    }

    current += 1;
    mostGames = Math.max(mostGames, current);
  }

  return mostGames;
};

export const getLongestWinStreak = (games: GameOutcome[]): number => {
  let longestStreak = 0;
  let currentStreak = 0;
  for (const game of games) {
    if (game.won) {
      currentStreak++;
      longestStreak = Math.max(currentStreak, longestStreak);
    } else {
      currentStreak = 0;
    }
  }

  return longestStreak;
};

export const getCurrentStreak = (games: GameOutcome[]): number => {
  const lastGame = games.at(-1);

  if (!lastGame) return 0;

  const flipIndex = games.findLastIndex((game) => game.won !== lastGame.won);

  return (lastGame.won ? 1 : -1) * games.length - (flipIndex + 1);
};
