import { Game, Player } from '../document-types/Games';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { shortIdLength } from './shortId';

export type JoinGameData = {
  gameId?: string;
  shortId?: string;
};

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
    const { shortId, gameId } = data;

    let gameRef:
      | admin.firestore.DocumentReference<admin.firestore.DocumentData>
      | undefined;
    let gameDoc:
      | admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>
      | undefined;

    // If using a short id, has to first find the actual game id
    if (shortId) {
      if (shortId.length !== shortIdLength) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'shortId must be exactly 5 characters long',
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
      gameDoc = gameSnapshot.docs[0];
      gameRef = gameDoc.ref;
    }
    // If using a game id, just get the game directly
    else if (gameId) {
      gameRef = firestore.doc(`games/${gameId}`);
      gameDoc = await gameRef.get();
    }

    if (!gameRef || !gameDoc || !gameDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'No game exists for this ID',
      );
    }

    const game = gameDoc.data() as Partial<Game>;

    if (!game.players?.find((player) => player.id === playerId)) {
      const newPlayer: Player = {
        id: playerId,
        hasResigned: false,
      };

      await gameRef.update({
        players: admin.firestore.FieldValue.arrayUnion(newPlayer),
      });
    }

    return gameId ?? gameRef.id;
  });

export default joinGame;
