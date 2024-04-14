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
    const { gameId, playerId } = context.params;
    const gameRef = firestore.doc(`games/${gameId}`);
    const game = (await gameRef.get()).data() as Game;
    const activePlayers = game.players
      .filter((player) => !player.dead)
      .map((player) => player.id);

    const nextTurnsRef = firestore.collection(`games/${gameId}/nextTurns`);
    const nextTurnsSnapshot = await nextTurnsRef.get();

    // Filters out any dead players who somehow submitted a next turn
    const nextTurnsDocs = nextTurnsSnapshot.docs.filter(({ id }) =>
      activePlayers.includes(id),
    );
    await gameRef.update({
      players: game.players.map((player) =>
        player.id === playerId ? { ...player, sent: true } : player,
      ),
    });
    // Not all players have submitted their next turn
    if (nextTurnsDocs.length < activePlayers.length) return;

    // Ensure same order of players as nextTurns
    nextTurnsDocs.sort(
      (a, b) => activePlayers.indexOf(a.id) - activePlayers.indexOf(b.id),
    );
    const nextTurns = nextTurnsDocs.map((doc) => doc.data() as NextTurn);

    // Get new board state & players state
    const { newBoardState, newPlayers, winner } = updateBoardTurn({
      game,
      nextTurns,
      players: activePlayers,
    });

    await gameRef.update({
      boardState: newBoardState,
      players: newPlayers,
      pastTurns: admin.firestore.FieldValue.arrayUnion({
        boardState: game.boardState,
      }),
      winner: winner,
      endedAt: winner ? Timestamp.now() : null,
    });

    // Delete all documents in next turn collection
    await Promise.all(nextTurnsSnapshot.docs.map((doc) => doc.ref.delete()));

    return null;
  });

export default onNewNextTurn;
