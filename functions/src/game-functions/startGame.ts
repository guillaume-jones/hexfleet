import { Game, StartGameData } from '../document-types/Games';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';

import { addPlayersToBoard } from '../game-logic/addPlayersToBoard';

const firestore = admin.firestore();

const joinGame = functions
  .runWith({ minInstances: 0, memory: '512MB' })
  .https.onCall(async (data?: Partial<StartGameData>, context?) => {
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

    const { gameId } = data;
    if (!gameId) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing id');
    }

    const gameRef = firestore.doc(`games/${gameId}`);
    const gameData = (await gameRef.get()).data() as Game;

    if (!gameData.players || !gameData.players.find((p) => p.id === playerId)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Not a player in this game',
      );
    }
    if (gameData.hasStarted) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Game has already started',
      );
    }

    const newBoardState = addPlayersToBoard(gameData);

    await gameRef.update({
      boardState: newBoardState,
      hasStarted: true,
      startedAt: Timestamp.now(),
    });
  });

export default joinGame;
