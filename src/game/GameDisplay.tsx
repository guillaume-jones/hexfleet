import React, { useContext } from 'react';

import GameCode from './GameCode';
import { GameContext } from './GameContext';
import HexagonalBoard from './HexagonalBoard';
import ScoreBox from './ScoreBox';

const GameDisplay = () => {
  const { board, boardSize, hasStarted } = useContext(GameContext);

  return (
    <div className="flex max-w-5xl flex-col items-center justify-end gap-6 pt-4 lg:flex-row lg:items-end">
      <div className="flex flex-col items-center gap-6 sm:flex-row lg:absolute lg:left-4 lg:top-8 lg:flex-col lg:items-start">
        <ScoreBox />
        {!hasStarted && <GameCode />}
      </div>
      <HexagonalBoard board={board} boardSize={boardSize} />
    </div>
  );
};

export default GameDisplay;
