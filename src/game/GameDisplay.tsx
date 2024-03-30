import React, { useContext } from 'react';

import GameCode from './GameCode';
import HexagonalBoard from './HexagonalBoard';
import ScoreBox from './ScoreBox';
import { GameContext } from './game-context/GameContext';

const GameDisplay = () => {
  const { boardState: board, boardSize, hasStarted } = useContext(GameContext);

  return (
    <div className="flex flex-col items-center justify-start gap-6 pt-4 lg:flex-row lg:items-end">
      <div className="flex flex-col items-center gap-6 sm:flex-row lg:absolute lg:left-4 lg:top-8 lg:flex-col lg:items-start">
        <ScoreBox />
        {!hasStarted && <GameCode />}
      </div>
      <HexagonalBoard
        className="lg:ml-64"
        board={board}
        boardSize={boardSize}
      />
    </div>
  );
};

export default GameDisplay;
