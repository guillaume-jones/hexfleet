import { BoardOptions, generateBoard } from '../board/generateBoard';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { customAlphabet } from 'nanoid';

import { Game } from 'functions/src/document-types/Games';
import {
  defaultPlayer,
  shortIdLength,
} from 'functions/src/game-logic/GameConstants';

import { auth, firestore } from 'src/firebase/firebaseApp';

const nanoid = customAlphabet(
  '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ',
  shortIdLength,
);

export const createGame = async (boardOptions: BoardOptions) => {
  const id = auth.currentUser?.uid;

  if (!id) {
    console.error('User must be authenticated');
    return;
  }

  const boardState = generateBoard(boardOptions);
  const newGame: Game = {
    boardSize: boardOptions.boardSize,
    boardState,
    hasStarted: false,
    createdAt: Timestamp.now(),
    startedAt: null,
    endedAt: null,
    pastTurns: [],
    players: [{ id, ...defaultPlayer }],
    shortId: nanoid(),
    winner: null,
  };

  const docRef = await addDoc(collection(firestore, 'games'), newGame);

  return { id: docRef.id, shortId: newGame.shortId };
};
