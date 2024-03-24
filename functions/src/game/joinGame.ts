import { Game, JoinGameData, Player } from '../document-types/Games';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { shortIdLength } from './shortId';

const firestore = admin.firestore();

const joinGame = functions
  .runWith({ minInstances: 0, memory: '512MB' })
  .https.onCall(async (data?: Partial<JoinGameData>, context?) => {
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

    const { shortId } = data;
    if (!shortId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing shortId',
      );
    }
    if (shortId.length !== shortIdLength) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `shortId must be exactly ${shortIdLength} characters`,
      );
    }

    const gameSnapshot = await firestore
      .collection('games')
      .where('hasStarted', '==', false)
      .where('shortId', '==', shortId)
      .get();

    if (gameSnapshot.empty) {
      throw new functions.https.HttpsError(
        'not-found',
        'No game exists for this short ID',
      );
    }

    const gameRef = gameSnapshot.docs[0].ref;
    const game = gameSnapshot.docs[0].data() as Partial<Game>;

    if (!game.players?.find((player) => player.id === playerId)) {
      const newPlayer: Player = {
        id: playerId,
        hasResigned: false,
      };

      await gameRef.update({
        players: admin.firestore.FieldValue.arrayUnion(newPlayer),
      });
    }

    return gameRef.id;
  });

export default joinGame;
