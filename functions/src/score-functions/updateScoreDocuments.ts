import { Game } from '../document-types/Games';
import { Score } from '../document-types/Score';
import * as admin from 'firebase-admin';

import { get1v1EloUpdate } from './getEloUpdate';
import { get1v1WinLossUpdate, getFFAWinLossUpdate } from './getWinLossUpdate';

const firestore = admin.firestore();

export const updateScoreDocuments = async (gameId: string) => {
  const gameRef = firestore.doc(`games/${gameId}`);
  const gameData = (await gameRef.get()).data() as Game;

  const isFFA = gameData.players.length > 2;
  const winner = gameData.winner;
  const playerIds = gameData.players.map((p) => p.id);
  if (!winner) return;

  const scoresRef = firestore
    .collection('scores')
    .where(admin.firestore.FieldPath.documentId(), 'in', playerIds);
  const scoresSnapshot = await scoresRef.get();
  const scores = scoresSnapshot.docs.reduce((acc, doc) => {
    const data = doc.data() as Score;
    return { ...acc, [doc.id]: data };
  }, {} as { [key: string]: Score });

  const scoreUpdates = gameData.players.map((p) => {
    const scoreRef = firestore.doc(`scores/${p.id}`);

    const scoreUpdate = isFFA
      ? getFFAWinLossUpdate({ playerId: p.id, playerIds, winner })
      : {
          ...get1v1WinLossUpdate({ playerId: p.id, playerIds, winner }),
          ...get1v1EloUpdate({ scores, playerId: p.id, playerIds, winner }),
        };

    return scoreRef.update(scoreUpdate);
  });

  await Promise.all(scoreUpdates);
};
