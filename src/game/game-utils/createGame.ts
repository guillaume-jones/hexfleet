import { BoardOptions, generateBoard } from '../board-utils/generateBoard';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { customAlphabet } from 'nanoid';

import { Game } from 'functions/src/document-types/Games';
import { shortIdLength } from 'functions/src/game/shortId';

import { auth, firestore } from 'src/firebase/firebaseApp';

const nanoid = customAlphabet(
  '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ',
  shortIdLength,
);

export const createGame = async (boardOptions: BoardOptions) => {
  const id = auth.currentUser?.uid;

  console.log({ id });
  if (!id) {
    console.error('User must be authenticated');
    return;
  }

  const boardState = generateBoard(boardOptions);
  const newGame: Game = {
    boardSize: boardOptions.boardSize,
    boardState,
    createdAt: Timestamp.now(),
    hasStarted: false,
    pastTurns: [],
    players: [{ id, hasResigned: false }],
    shortId: nanoid(),
  };

  const docRef = await addDoc(collection(firestore, 'games'), newGame);

  return docRef.id;
};
