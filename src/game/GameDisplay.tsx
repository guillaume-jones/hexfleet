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
    <div className="flex flex-col items-center gap-6 px-4 py-4 xl:flex-row xl:items-stretch">
      <div
        className="flex flex-col items-center gap-4 md:flex-row xl:flex-col xl:items-start
      ">
        <ScoreBox />
        <div className="flex flex-1 flex-row items-center justify-between gap-4 xl:w-auto xl:flex-col xl:items-start">
          {hasStarted ? <div className="hidden xl:block" /> : <GameCodeBox />}
          {!userResigned && <GameActions />}
        </div>
      </div>
      {!hasStarted || userResigned ? (
        <SimpleHexBoard
          className="max-w-[880px] xl:-ml-12"
          board={boardState}
          boardSize={boardSize}
        />
      ) : (
        <HexagonalBoard className="h-full w-full xl:-ml-12 xl:h-[770px]" />
      )}
    </div>
  );
};

export default GameDisplay;
