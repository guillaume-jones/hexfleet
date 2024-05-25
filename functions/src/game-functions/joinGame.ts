import { Game, Player } from '../document-types/Games';
import {
  defaultPlayer,
  maximumPlayers,
  shortIdLength,
} from '../game-logic/GameConstants';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { JoinGameData } from './functionInputs';

const firestore = admin.firestore();

const joinGame = async (
  data?: Partial<JoinGameData>,
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

  const { shortId } = data;
  if (!shortId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing shortId');
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
  const game = gameSnapshot.docs[0].data() as Game;

  if (game.players.length >= maximumPlayers) {
    throw new functions.https.HttpsError('failed-precondition', 'Game is full');
  }

  if (!game.players.find((player) => player.id === playerId)) {
    const newPlayer: Player = { id: playerId, ...defaultPlayer };

    await gameRef.update({
      players: admin.firestore.FieldValue.arrayUnion(newPlayer),
    });
  }

  return gameRef.id;
};

export default joinGame;
