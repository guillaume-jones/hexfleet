import { sum } from 'lodash';

import { Tile } from 'functions/src/document-types/Games';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { getPlayersInfluence } from 'functions/src/game-logic/influenceUtils';

export type BoardInfluences = {
  myInfluence: number;
  enemyInfluence: number;
  relativeInfluence: number;
};

export const getAiInfluence = ({
  boardState,
  boardSize,
  myId,
}: {
  boardState: Tile[];
  boardSize: number;
  myId: string;
}): BoardInfluences => {
  const boardWithBorders = addBordersToBoard(boardState, boardSize);
  const influences = getPlayersInfluence(boardWithBorders);

  const myInfluence = influences[myId];
  const enemyInfluence = sum(Object.values(influences)) - myInfluence;

  return {
    myInfluence,
    enemyInfluence,
    relativeInfluence: myInfluence - enemyInfluence,
  };
};
