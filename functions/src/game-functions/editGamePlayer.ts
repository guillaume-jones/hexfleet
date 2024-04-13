import { EditGamePlayerData, Game } from '../document-types/Games';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';

const firestore = admin.firestore();

const joinGame = functions
  .runWith({ minInstances: 0, memory: '512MB' })
  .https.onCall(async (data?: Partial<EditGamePlayerData>, context?) => {
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
            p.id === playerId ? { ...p, hasResigned: true } : p,
          );
          const alivePlayers = newPlayers.filter((p) => !p.hasResigned);

          // Multiple players have resigned at the same time
          if (alivePlayers.length === 0) return;

          await gameRef.update({
            players: newPlayers,
            winner: alivePlayers.length === 1 ? alivePlayers[0].id : null,
            endedAt: alivePlayers.length === 1 ? Timestamp.now() : null,
          });
        }
        break;
    }
  });

export default joinGame;
