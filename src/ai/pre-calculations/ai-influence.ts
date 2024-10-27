import { sum } from 'lodash';

import { Tile } from 'functions/src/document-types/Games';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { getPlayersInfluence } from 'functions/src/game-logic/influenceUtils';

import { aiId } from 'src/game/create-game/createGame';

export type BoardInfluences = {
  aiInfluence: number;
  enemyInfluence: number;
  relativeInfluence: number;
};

export const getAiInfluence = ({
  boardState,
  boardSize,
}: {
  boardState: Tile[];
  boardSize: number;
}): BoardInfluences => {
  const boardWithBorders = addBordersToBoard(boardState, boardSize);
  const influences = getPlayersInfluence(boardWithBorders);

  const aiInfluence = influences[aiId];
  const enemyInfluence = sum(Object.values(influences)) - aiInfluence;

  return {
    aiInfluence,
    enemyInfluence,
    relativeInfluence: aiInfluence - enemyInfluence,
  };
};
