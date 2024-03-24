import React, { useContext } from 'react';

import GameCode from './GameCode';
import { GameContext } from './GameContext';
import HexagonalBoard from './HexagonalBoard';
import ScoreBox from './ScoreBox';

const GameDisplay = () => {
  const { board, boardSize } = useContext(GameContext);

  return (
    <div className="flex max-w-5xl flex-col items-center justify-end gap-6  lg:flex-row lg:items-end">
      <div className="flex items-center gap-6 lg:absolute lg:left-4 lg:top-4 lg:flex-col">
        <ScoreBox />
        <GameCode />
      </div>
      <HexagonalBoard board={board} boardSize={boardSize} />
    </div>
  );
};

export default GameDisplay;
