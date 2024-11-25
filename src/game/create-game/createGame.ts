import { BoardOptions, generateBoard } from '../board/generateBoard';
import { Timestamp, addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { customAlphabet } from 'nanoid';

import { Game } from 'functions/src/document-types/Games';
import {
  defaultPlayer,
  shortIdLength,
} from 'functions/src/game-logic/GameConstants';
import { addPlayersToBoard } from 'functions/src/game-logic/addPlayersToBoard';

import { campaignMaps } from 'src/campaign/campaign-maps';
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

const createGame = (
  boardOptions: BoardOptions,
  gameOptions?: Partial<Game>,
): Game | undefined => {
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
    shortId: shortIdGenerator(),
    winner: null,
    pastTurns: [],
    ...gameOptions,
    players: [...(gameOptions?.players ?? []), { ...defaultPlayer, id }],
  };
};

export const createOnlineGame = async (boardOptions: BoardOptions) => {
  const game = createGame(boardOptions);
  if (!game) return;

  const docRef = await addDoc(collection(firestore, 'games'), game);

  return { id: docRef.id, shortId: game.shortId };
};

export const createCampaignGame = async (gameId: string) => {
  const id = auth.currentUser?.uid;
  if (!id) return;

  const campaignMap = campaignMaps.find(({ id }) => id === gameId);
  if (!campaignMap) return;

  const game = createGame(campaignMap, {
    shortId: gameId,
    hasStarted: true,
    startedAt: Timestamp.now(),
    players: [{ ...defaultPlayer, id: aiId }],
  });
  if (!game) return;

  game.boardState = addPlayersToBoard(game);
  await setDoc(doc(firestore, 'campaigns', id, 'games', gameId), game);

  return { gameId };
};

export const createAIGame = (
  boardOptions: BoardOptions,
  players: string[],
): Game => {
  const boardState = generateBoard(boardOptions);
  const game = {
    boardSize: boardOptions.boardSize,
    boardState,
    hasStarted: true,
    createdAt: Timestamp.now(),
    startedAt: Timestamp.now(),
    endedAt: null,
    pastTurns: [],
    players: players.map((id) => ({ ...defaultPlayer, id })),
    shortId: shortIdGenerator(),
    winner: null,
  };

  game.boardState = addPlayersToBoard(game);

  return game;
};
