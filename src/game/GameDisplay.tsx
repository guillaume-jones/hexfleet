import React, { useContext } from 'react';

import HexagonalBoard from './board/HexagonalBoard';
import SimpleHexBoard from './board/SimpleHexBoard';
import { GameContext } from './game-context/GameContext';
import ActionsBox from './game-elements/ActionsBox';
import GameCodeBox from './game-elements/GameCodeBox';
import HelpBox from './game-elements/HelpBox';
import PlayersBox from './game-elements/PlayersBox';

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
        <PlayersBox />

        <div className="flex flex-1 flex-row items-center justify-between gap-4 xl:w-auto xl:flex-col xl:items-start">
          {hasStarted ? <div className="hidden xl:block" /> : <GameCodeBox />}
          {!userResigned && <ActionsBox />}
        </div>
      </div>
      <div className="min-h-0 self-stretch xl:-mx-10">
        {!hasStarted || userResigned || winner ? (
          <SimpleHexBoard board={boardState} boardSize={boardSize} />
        ) : (
          <HexagonalBoard />
        )}
      </div>
      {hasStarted && (
        <HelpBox className="flex flex-1 justify-end sm:self-end" />
      )}
    </div>
  );
};

export default GameDisplay;
