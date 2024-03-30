import React, { useContext } from 'react';

import GameCodeBox from './GameCodeBox';
import HexagonalBoard from './HexagonalBoard';
import MinorGameActions from './MinorGameActions';
import ScoreBox from './ScoreBox';
import { GameContext } from './game-context/GameContext';

const GameDisplay = () => {
  const { boardState: board, boardSize, hasStarted } = useContext(GameContext);

  return (
    <div className="flex flex-col items-center justify-start gap-6 py-4 lg:flex-row lg:items-end">
      <div className="flex flex-col items-center gap-6 sm:flex-row lg:absolute lg:left-4 lg:top-8 lg:flex-col lg:items-start">
        <ScoreBox />
        {!hasStarted && <GameCodeBox />}
      </div>
      <MinorGameActions className="lg:absolute lg:bottom-48 lg:left-4" />
      <HexagonalBoard
        className="lg:ml-64"
        board={board}
        boardSize={boardSize}
      />
    </div>
  );
};

export default GameDisplay;
