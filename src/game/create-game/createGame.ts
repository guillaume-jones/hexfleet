import { BoardOptions, generateBoard } from '../board/generateBoard';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { customAlphabet } from 'nanoid';

import { Game } from 'functions/src/document-types/Games';
import {
  defaultPlayer,
  shortIdLength,
} from 'functions/src/game-logic/GameConstants';
import { addPlayersToBoard } from 'functions/src/game-logic/addPlayersToBoard';

import { aiId, getCampaignMapForUser } from 'src/campaign/campaign-maps';
import { auth, firestore } from 'src/firebase/firebaseApp';

const shortIdGenerator = customAlphabet(
  '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ',
  shortIdLength,
);

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

export const createCampaignGame = (gameId: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const campaignMap = getCampaignMapForUser(gameId, userId);
  if (!campaignMap) return;

  return createGame(campaignMap, {
    shortId: gameId,
    hasStarted: true,
    startedAt: Timestamp.now(),
    players: [{ ...defaultPlayer, id: aiId }],
  });
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
