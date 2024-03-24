import React, { useContext } from 'react';

import { GameContext } from './GameContext';
import HexagonalBoard from './HexagonalBoard';
import ScoreBox from './ScoreBox';

const GameDisplay = () => {
  const { board, boardSize } = useContext(GameContext);

  return (
    <div className="flex max-w-5xl items-center gap-6 lg:items-end">
      <div className="lg:absolute lg:left-4 lg:top-4">
        <ScoreBox />
      </div>
      <HexagonalBoard board={board} boardSize={boardSize} />
    </div>
  );
};

export default GameDisplay;
