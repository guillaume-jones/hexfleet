import { Score } from '../document-types/Score';
import mean from 'lodash/mean';

import { K, denominator, initialElo } from './eloConstants';

const calculateEloUpdate = ({
  playerElo,
  opponentElo,
  outcome,
}: {
  playerElo: number;
  opponentElo: number;
  outcome: number;
}) => {
  const expectedOutcome =
    1 / (1 + 10 ** ((opponentElo - playerElo) / denominator));

  return playerElo + K * (outcome - expectedOutcome);
};

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

  const eloUpdate = calculateEloUpdate({
    playerElo,
    opponentElo: scores[opponent]?.elo1v1 || initialElo,
    outcome: playerId === winner ? 1 : 0,
  });

  return {
    elo1v1: playerElo + eloUpdate,
  };
};

export const getFFAEloUpdate = ({
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
  const playerElo = scores[playerId]?.eloFFA || initialElo;

  const opponents = playerIds.filter((p) => p !== playerId);

  const eloUpdates = opponents.map((opponent) => {
    // Two players who lose do not take points from each other
    if (playerId !== winner && opponent !== winner) return 0;

    return calculateEloUpdate({
      playerElo,
      opponentElo: scores[opponent]?.eloFFA || initialElo,
      outcome: playerId === winner ? 1 : 0,
    });
  });

  const eloUpdate = mean(eloUpdates);

  return {
    eloFFA: playerElo + eloUpdate,
  };
};
