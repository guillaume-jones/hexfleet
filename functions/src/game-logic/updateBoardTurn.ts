import { Game, NextTurn } from '../document-types/Games';

import { addBordersToBoard } from './addBordersToBoard';
import { calculateNewBoardState } from './calculateNewBoardState';
import { getInfluenceSpent, getPlayersInfluence } from './influenceUtils';
import { updatePlayerStatus } from './updatePlayerStatus';
import { validateTileClear, validateTilePressure } from './validationUtils';

export const updateBoardTurn = ({
  game,
  nextTurns,
  players,
}: {
  game: Game;
  nextTurns: NextTurn[];
  // Expects player ids to be in same order as nextTurns
  players: string[];
}) => {
  const { boardState, boardSize } = game;

  const playerInfluences = getPlayersInfluence(
    addBordersToBoard(boardState, boardSize),
  );

  // Validates all nextTurns
  const validNextTurns = nextTurns
    .map((nextTurn, i) => {
      const validPressures = nextTurn.pressures.filter((tilePressure) => {
        const foundTile = boardState.find(({ x, y }) => {
          return x === tilePressure.x && y === tilePressure.y;
        });
        if (!foundTile) return false;
        const tile = { ...foundTile, ...tilePressure };

        return (
          validateTilePressure({
            tile,
            boardState,
            boardSize,
            id: players[i],
          }) && validateTileClear({ tile, id: players[i] })
        );
      });

      const influenceToSpend = playerInfluences[players[i]];
      const influenceCost = getInfluenceSpent({ pressures: validPressures });

      if (!influenceToSpend || influenceCost > influenceToSpend) return false;

      return { pressures: validPressures };
    })
    .filter((nextTurn, i): nextTurn is NextTurn => {
      if (!nextTurn) {
        players = players.filter((id) => id !== players[i]);
        return false;
      }
      return true;
    });

  // Applies next turn logic
  const newBoardState = calculateNewBoardState(
    boardState,
    validNextTurns,
    players,
  );
  const newPlayers = updatePlayerStatus(newBoardState, game.players);

  return { newBoardState, newPlayers };
};
