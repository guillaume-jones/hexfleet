import React, { useContext } from 'react';

import GameActions from './GameActions';
import GameCodeBox from './GameCodeBox';
import HexagonalBoard from './HexagonalBoard';
import ScoreBox from './ScoreBox';
import { GameContext } from './game-context/GameContext';

const GameDisplay = () => {
  const { boardState, boardSize, hasStarted, userId, updateNextTurn } =
    useContext(GameContext);

  return (
    <div className="flex flex-col items-center justify-start gap-6 py-4 lg:flex-row lg:items-end">
      <div className="flex flex-col items-center gap-6 sm:flex-row lg:absolute lg:left-4 lg:top-8 lg:flex-col lg:items-start">
        <ScoreBox />
        {!hasStarted && <GameCodeBox />}
      </div>
      <GameActions className="lg:absolute lg:bottom-40 lg:left-4" />
      <HexagonalBoard
        className="lg:ml-72"
        board={boardState}
        boardSize={boardSize}
        userId={userId}
        onTileAction={updateNextTurn}
      />
    </div>
  );
};

export default GameDisplay;
