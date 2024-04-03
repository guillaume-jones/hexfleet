import React, { useContext } from 'react';

import GameActions from './GameActions';
import GameCodeBox from './GameCodeBox';
import ScoreBox from './ScoreBox';
import HexagonalBoard from './board/HexagonalBoard';
import { GameContext } from './game-context/GameContext';

const GameDisplay = () => {
  const { hasStarted } = useContext(GameContext);

  return (
    <div className="flex flex-col items-center justify-start gap-6 py-2 lg:flex-row lg:items-end">
      <div className="flex flex-col items-center gap-6 sm:flex-row lg:absolute lg:left-4 lg:top-8 lg:flex-col lg:items-start">
        <ScoreBox />
        {!hasStarted && <GameCodeBox />}
      </div>
      <GameActions className="lg:absolute lg:bottom-40 lg:left-4" />
      <HexagonalBoard className="lg:ml-72" />
    </div>
  );
};

export default GameDisplay;
