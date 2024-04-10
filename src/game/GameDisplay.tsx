import React, { useContext } from 'react';

import GameActions from './GameActions';
import GameCodeBox from './GameCodeBox';
import ScoreBox from './ScoreBox';
import HexagonalBoard from './board/HexagonalBoard';
import SimpleHexBoard from './board/SimpleHexBoard';
import { GameContext } from './game-context/GameContext';

const GameDisplay = () => {
  const { hasStarted, userResigned, boardState, boardSize } =
    useContext(GameContext);

  return (
    <div className="flex flex-col items-center gap-6 py-4 xl:flex-row">
      <div
        className="mx-2 flex flex-col items-center gap-4 md:flex-row xl:ml-4 xl:flex-col xl:items-start
      ">
        <ScoreBox />
        <div className="flex flex-row items-center justify-between gap-4 xl:h-[69vh] xl:w-auto xl:flex-col xl:items-start">
          {hasStarted ? <div /> : <GameCodeBox />}
          {!userResigned && <GameActions />}
        </div>
      </div>
      {!hasStarted || userResigned ? (
        <SimpleHexBoard
          className="max-w-[880px] xl:-ml-16"
          board={boardState}
          boardSize={boardSize}
        />
      ) : (
        <HexagonalBoard className="max-w-[880px]  xl:-ml-16" />
      )}
    </div>
  );
};

export default GameDisplay;
