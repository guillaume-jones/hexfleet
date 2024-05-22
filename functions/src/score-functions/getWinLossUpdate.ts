import { Score } from '../document-types/Score';

export const get1v1WinLossUpdate = ({
  scores,
  playerId,
  playerIds,
  winner,
}: {
  scores: { [key: string]: Score };
  playerId: string;
  playerIds: string[];
  winner: string;
}) => {
  const playerScore = scores[playerId];
  const won = playerId === winner;
  const winsLosses = {
    wins1v1: playerScore.wins1v1 + (won ? 1 : 0),
    losses1v1: playerScore.losses1v1 + (won ? 0 : 1),
  };

  const opponent = playerIds.filter((p) => p !== playerId)[0];

  return {
    ...winsLosses,
    versus: {
      [opponent]: {
        wins1v1: (playerScore.versus[opponent]?.wins1v1 ?? 0) + (won ? 1 : 0),
        losses1v1:
          (playerScore.versus[opponent]?.losses1v1 ?? 0) + (won ? 0 : 1),
      },
    },
  };
};

export const getFFAWinLossUpdate = ({
  scores,
  playerId,
  playerIds,
  winner,
}: {
  scores: { [key: string]: Score };
  playerId: string;
  playerIds: string[];
  winner: string;
}) => {
  const playerScore = scores[playerId];
  const won = playerId === winner;
  const winsLosses = {
    winsFFA: playerScore.winsFFA + (won ? 1 : 0),
    lossesFFA: playerScore.lossesFFA + (won ? 0 : 1),
  };

  const opponents = playerIds.filter((p) => p !== playerId);

  const versus = opponents.reduce((acc, opponent) => {
    return {
      ...acc,
      [opponent]: {
        winsFFA: (playerScore.versus[opponent]?.winsFFA ?? 0) + (won ? 1 : 0),
        lossesFFA:
          (playerScore.versus[opponent]?.lossesFFA ?? 0) + (won ? 0 : 1),
      },
    };
  }, {});

  return {
    ...winsLosses,
    versus,
  };
};
