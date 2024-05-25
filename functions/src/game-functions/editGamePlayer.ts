import { Game } from '../document-types/Games';
import { updateScoreDocuments } from '../score-functions/updateScoreDocuments';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';

import { EditGamePlayerData } from './functionInputs';

const firestore = admin.firestore();

const editGamePlayer = async (
  data?: Partial<EditGamePlayerData>,
  context?: functions.https.CallableContext,
) => {
  if (!data) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing data');
  }
  const playerId = context?.auth?.uid;
  if (!playerId) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Not an authenticated user',
    );
  }

  const { gameId, action } = data;
  if (!gameId || !action) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing id or action',
    );
  }

  const gameRef = firestore.doc(`games/${gameId}`);
  const gameData = (await gameRef.get()).data() as Game;

  const player = gameData.players?.find((p) => p.id === playerId);

  if (!player) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Could not find player in game',
    );
  }

  switch (action) {
    case 'leave':
      await gameRef.update({
        players: gameData.players.filter((p) => p.id !== playerId),
      });
      break;
    case 'resign':
      {
        const newPlayers = gameData.players.map((p) =>
          p.id === playerId ? { ...p, dead: true } : p,
        );
        const alivePlayers = newPlayers.filter((p) => !p.dead);

        // Multiple players have resigned at the same time
        if (alivePlayers.length === 0) return;

        // Game is over
        if (alivePlayers.length === 1) {
          await gameRef.update({
            players: newPlayers,
            winner: alivePlayers[0].id,
            endedAt: Timestamp.now(),
          });
          // Delete all documents in next turn collection
          const nextTurnsSnapshot = await firestore
            .collection(`games/${gameId}/nextTurns`)
            .get();
          await Promise.all(
            nextTurnsSnapshot.docs.map((doc) => doc.ref.delete()),
          );
          // Update scores
          await updateScoreDocuments(gameId);
        } else {
          await gameRef.update({ players: newPlayers });
        }
      }
      break;
  }
};

export default editGamePlayer;
