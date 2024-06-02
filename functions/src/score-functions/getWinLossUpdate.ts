import { GameOutcome, Score } from '../document-types/Score';

export const get1v1WinLossUpdate = ({
  scores,
  playerId,
  playerIds,
  winner,
  gameOutcome,
}: {
  scores: { [key: string]: Score };
  playerId: string;
  playerIds: string[];
  winner: string;
  gameOutcome: GameOutcome;
}) => {
  const playerScore = scores[playerId];
  const won = playerId === winner;
  const winsLosses = {
    wins1v1: playerScore.wins1v1 + (won ? 1 : 0),
    losses1v1: playerScore.losses1v1 + (won ? 0 : 1),
  };

  const opponent = playerIds.filter((p) => p !== playerId)[0];
  const versusOpponent = playerScore.versus[opponent];

  return {
    ...winsLosses,
    versus: {
      ...playerScore.versus,
      [opponent]: {
        ...versusOpponent,
        wins1v1: (versusOpponent?.wins1v1 ?? 0) + (won ? 1 : 0),
        losses1v1: (versusOpponent?.losses1v1 ?? 0) + (won ? 0 : 1),
        pastGames: versusOpponent
          ? [...versusOpponent.pastGames, gameOutcome]
          : [gameOutcome],
      },
    },
  };
};

export const getFFAWinLossUpdate = ({
  scores,
  playerId,
  playerIds,
  winner,
  gameOutcome,
}: {
  scores: { [key: string]: Score };
  playerId: string;
  playerIds: string[];
  winner: string;
  gameOutcome: GameOutcome;
}) => {
  const playerScore = scores[playerId];
  const won = playerId === winner;
  const winsLosses = {
    winsFFA: playerScore.winsFFA + (won ? 1 : 0),
    lossesFFA: playerScore.lossesFFA + (won ? 0 : 1),
  };

  const opponents = playerIds.filter((p) => p !== playerId);

  return {
    ...winsLosses,
    versus: opponents.reduce((acc, opponent) => {
      const versusOpponent = playerScore.versus[opponent];
      return {
        ...acc,
        [opponent]: {
          ...versusOpponent,
          winsFFA: (versusOpponent?.winsFFA ?? 0) + (won ? 1 : 0),
          lossesFFA: (versusOpponent?.lossesFFA ?? 0) + (won ? 0 : 1),
          pastGames: versusOpponent
            ? [...versusOpponent.pastGames, gameOutcome]
            : [gameOutcome],
        },
      };
    }, playerScore.versus),
  };
};
