import { BoardOptions, generateBoard } from '../board/generateBoard';
import { spGameKey } from '../game-context/useSinglePlayerGame';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { customAlphabet, nanoid } from 'nanoid';

import { Game } from 'functions/src/document-types/Games';
import {
  defaultPlayer,
  shortIdLength,
} from 'functions/src/game-logic/GameConstants';
import { addPlayersToBoard } from 'functions/src/game-logic/addPlayersToBoard';

import { auth, firestore } from 'src/firebase/firebaseApp';

const shortIdGenerator = customAlphabet(
  '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ',
  shortIdLength,
);

export const aiId = 'AI';

export const defaultGameOptions = {
  boardSize: 9,
  playerCount: 2,
};

const createGame = (boardOptions: BoardOptions): Game | undefined => {
  const id = auth.currentUser?.uid;

  if (!id) {
    console.error('User must be authenticated');
    return;
  }

  const boardState = generateBoard(boardOptions);
  return {
    boardSize: boardOptions.boardSize,
    boardState,
    hasStarted: false,
    createdAt: Timestamp.now(),
    startedAt: null,
    endedAt: null,
    pastTurns: [],
    players: [{ ...defaultPlayer, id }],
    shortId: shortIdGenerator(),
    winner: null,
  };
};

export const createOnlineGame = async (boardOptions: BoardOptions) => {
  const game = createGame(boardOptions);

  if (!game) return;

  const docRef = await addDoc(collection(firestore, 'games'), game);

  return { id: docRef.id, shortId: game.shortId };
};

export const createSinglePlayerGame = (boardOptions: BoardOptions) => {
  const game = createGame(boardOptions);
  const id = nanoid(20);

  if (!game) return;

  game.players.unshift({ id: aiId, ...defaultPlayer });
  game.boardState = addPlayersToBoard(game);
  game.hasStarted = true;
  game.startedAt = Timestamp.now();

  localStorage.setItem(spGameKey(id), JSON.stringify(game));

  return { id };
};
