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
    .map((nextTurn, i): NextTurn | false => {
      const validPressures = nextTurn.pressures.filter((tilePressure) => {
        // Tries to find the corresponding board tile for the pressure
        const foundTile = boardState.find(({ x, y }) => {
          return x === tilePressure.x && y === tilePressure.y;
        });
        if (!foundTile) return false;
        const tile = { ...foundTile, ...tilePressure };

        // Verifies that the pressure or clear action is valid
        return (
          validateTilePressure({
            tile,
            boardState,
            boardSize,
            id: players[i],
          }) && validateTileClear({ tile, id: players[i] })
        );
      });

      // Verifies that player did not overspend their influence
      const influenceToSpend = playerInfluences[players[i]];
      const influenceCost = getInfluenceSpent({ pressures: validPressures });
      if (!influenceToSpend || influenceCost > influenceToSpend) return false;

      return { pressures: validPressures };
    })
    .filter((nextTurn, i): nextTurn is NextTurn => {
      if (nextTurn) return true;

      // Removes player from next turns to apply if their turn was invalid
      players = players.filter((id) => id !== players[i]);
      return false;
    });

  // Applies next turns to board state
  const newBoardState = calculateNewBoardState(
    boardState,
    validNextTurns,
    players,
  );
  // Removes dead players
  const newPlayers = updatePlayerStatus(newBoardState, game.players);
  // Detects a winner
  const alivePlayers = newPlayers.filter((p) => !p.hasResigned);

  return {
    newBoardState,
    newPlayers,
    winner: alivePlayers.length === 1 ? alivePlayers[0].id : null,
  };
};
