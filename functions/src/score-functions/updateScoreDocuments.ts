import { Game } from '../document-types/Games';
import * as admin from 'firebase-admin';

const firestore = admin.firestore();

const get1v1Update = ({
  player,
  playerIds,
  winner,
}: {
  player: string;
  playerIds: string[];
  winner: string;
}) => {
  const winsLosses = {
    wins1v1: admin.firestore.FieldValue.increment(player === winner ? 1 : 0),
    losses1v1: admin.firestore.FieldValue.increment(player === winner ? 0 : 1),
  };

  const opponent = playerIds.filter((p) => p !== player)[0];

  return {
    ...winsLosses,
    versus: { [opponent]: winsLosses },
  };
};

const getFFAUpdate = ({
  player,
  playerIds,
  winner,
}: {
  player: string;
  playerIds: string[];
  winner: string;
}) => {
  const winsLosses = {
    winsFFA: admin.firestore.FieldValue.increment(player === winner ? 1 : 0),
    lossesFFA: admin.firestore.FieldValue.increment(player === winner ? 0 : 1),
  };

  const opponents = playerIds.filter((p) => p !== player);

  const versus = opponents.reduce((acc, opponent) => {
    return { ...acc, [opponent]: winsLosses };
  }, {});

  return {
    ...winsLosses,
    versus,
  };
};

export const updateScoreDocuments = async (gameId: string) => {
  const gameRef = firestore.doc(`games/${gameId}`);
  const gameData = (await gameRef.get()).data() as Game;

  const isFFA = gameData.players.length > 2;
  const winner = gameData.winner;
  const playerIds = gameData.players.map((p) => p.id);
  if (!winner) return;

  const scoreUpdates = gameData.players.map((p) => {
    const scoreRef = firestore.doc(`scores/${p.id}`);

    const scoreUpdate = isFFA
      ? getFFAUpdate({ player: p.id, playerIds, winner })
      : get1v1Update({ player: p.id, playerIds, winner });

    return scoreRef.update(scoreUpdate);
  });

  await Promise.all(scoreUpdates);
};
