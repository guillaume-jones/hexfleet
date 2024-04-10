import { Game, NextTurn } from '../document-types/Games';
import { updateBoardTurn } from '../game-logic/updateBoardTurn';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';

const firestore = admin.firestore();

const onNewNextTurn = functions
  .runWith({ minInstances: 0, memory: '512MB' })
  .firestore.document('games/{gameId}/nextTurns/{playerId}')
  .onCreate(async (_, context) => {
    const { gameId } = context.params;
    const gameRef = firestore.doc(`games/${gameId}`);
    const game = (await gameRef.get()).data() as Game;
    const players = game.players
      .filter((player) => !player.hasResigned)
      .map((player) => player.id);

    const nextTurnsRef = firestore.collection(`games/${gameId}/nextTurns`);
    const nextTurnsSnapshot = await nextTurnsRef.get();

    // Not all players have submitted their next turn
    if (nextTurnsSnapshot.size < players.length) return;

    // Filters out any dead players who somehow submitted a next turn
    const nextTurnsDocs = nextTurnsSnapshot.docs.filter(({ id }) =>
      players.includes(id),
    );
    if (nextTurnsDocs.length !== players.length) return;

    // Ensure same order of players as nextTurns
    nextTurnsDocs.sort((a, b) => players.indexOf(a.id) - players.indexOf(b.id));
    const nextTurns = nextTurnsDocs.map((doc) => doc.data() as NextTurn);

    // Updates board state
    const { newBoardState, newPlayers } = updateBoardTurn({
      game,
      nextTurns,
      players,
    });

    // Checks for a winner
    const alivePlayers = newPlayers.filter((p) => !p.hasResigned);

    await gameRef.update({
      boardState: newBoardState,
      players: newPlayers,
      pastTurns: admin.firestore.FieldValue.arrayUnion({
        boardState: game.boardState,
      }),
      winner: alivePlayers.length === 1 ? alivePlayers[0].id : null,
      endedAt: alivePlayers.length === 1 ? Timestamp.now() : null,
    });

    // Delete all documents in next turn collection
    await Promise.all(nextTurnsSnapshot.docs.map((doc) => doc.ref.delete()));

    return null;
  });

export default onNewNextTurn;
