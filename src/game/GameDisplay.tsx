import React, { useContext } from 'react';

import GameActions from './GameActions';
import GameCodeBox from './GameCodeBox';
import ScoreBox from './ScoreBox';
import HexagonalBoard from './board/HexagonalBoard';
import SimpleHexBoard from './board/SimpleHexBoard';
import { GameContext } from './game-context/GameContext';

const GameDisplay = () => {
  const { hasStarted, userResigned, boardState, boardSize, winner } =
    useContext(GameContext);

  return (
    <div
      className={`
      ${
        // Arranges elements correctly
        'flex flex-1 flex-col items-center gap-4 p-4 xl:flex-row xl:items-stretch'
      }
      ${
        // Ensures board fits into window height if window is large
        window.innerHeight > 500
          ? 'h-auto sm:-mb-10 sm:h-full sm:flex-none sm:pb-14'
          : ''
      } 
     `}>
      <div
        className="flex flex-col items-center gap-4 md:flex-row xl:flex-col xl:items-start
      ">
        <ScoreBox />
        <div className="flex flex-1 flex-row items-center justify-between gap-4 xl:w-auto xl:flex-col xl:items-start">
          {hasStarted ? <div className="hidden xl:block" /> : <GameCodeBox />}
          {!userResigned && <GameActions />}
        </div>
      </div>
      <div className="min-h-0 self-stretch xl:-ml-10 ">
        {!hasStarted || userResigned || winner ? (
          <SimpleHexBoard board={boardState} boardSize={boardSize} />
        ) : (
          <HexagonalBoard />
        )}
      </div>
    </div>
  );
};

export default GameDisplay;
