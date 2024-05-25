import { Game } from '../document-types/Games';
import { minimumPlayers } from '../game-logic/GameConstants';
import { addPlayersToBoard } from '../game-logic/addPlayersToBoard';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';

import { StartGameData } from './functionInputs';

const firestore = admin.firestore();

const startGame = async (
  data?: Partial<StartGameData>,
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

  const { gameId } = data;
  if (!gameId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing id');
  }

  const gameRef = firestore.doc(`games/${gameId}`);
  const game = (await gameRef.get()).data() as Game;

  if (game.hasStarted) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Game has already started',
    );
  }
  if (game.players.length < minimumPlayers) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Not enough players to start game',
    );
  }
  if (!game.players || !game.players.find((p) => p.id === playerId)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Not a player in this game',
    );
  }

  const newBoardState = addPlayersToBoard(game);

  await gameRef.update({
    boardState: newBoardState,
    hasStarted: true,
    startedAt: Timestamp.now(),
  });
};

export default startGame;
