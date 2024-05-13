import { Score } from '../document-types/Score';

import { K, denominator, initialElo } from './eloConstants';

export const get1v1EloUpdate = ({
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
  const playerElo = scores[playerId]?.elo1v1 || initialElo;

  const opponent = playerIds.filter((p) => p !== playerId)[0];
  const opponentElo = scores[opponent]?.elo1v1 || initialElo;

  const expectedOutcome =
    1 / (1 + 10 ** ((opponentElo - playerElo) / denominator));
  const actualOutcome = playerId === winner ? 1 : 0;

  const updatedElo = playerElo + K * (actualOutcome - expectedOutcome);

  return {
    elo1v1: updatedElo,
  };
};
