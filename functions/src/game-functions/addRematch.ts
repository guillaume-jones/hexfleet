import { Game, RematchData } from '../document-types/Games';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const firestore = admin.firestore();

const addRematch = functions
  .runWith({ minInstances: 0, memory: '512MB' })
  .https.onCall(async (data?: Partial<RematchData>, context?) => {
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

    const { gameId, newGameId } = data;
    if (!gameId || !newGameId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing gameId or newGameId',
      );
    }

    const gameRef = firestore.doc(`games/${gameId}`);
    const newGameRef = firestore.doc(`games/${newGameId}`);

    const gameData = (await gameRef.get()).data() as Game;
    const newGameData = (await newGameRef.get()).data() as Game;

    if (!gameData.players?.find((p) => p.id === playerId)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Could not find player in game',
      );
    }

    await gameRef.update({
      rematchId: newGameData.shortId,
    });
    return;
  });

export default addRematch;
