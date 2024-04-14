import React, { useContext } from 'react';

import HexagonalBoard from './board/HexagonalBoard';
import SimpleHexBoard from './board/SimpleHexBoard';
import { GameContext } from './game-context/GameContext';
import ActionsBox from './game-elements/ActionsBox';
import GameCodeBox from './game-elements/GameCodeBox';
import HelpBox from './game-elements/HelpBox';
import PlayersBox from './game-elements/PlayersBox';
import RematchButton from './game-elements/RematchButton';

const GameDisplay = () => {
  const {
    loading,
    hasStarted,
    userDead,
    boardWithBorders,
    boardSize,
    winner,
  } = useContext(GameContext);

  return (
    <div
      className={`transition-opacity
      ${
        // Hide until game loaded
        loading ? 'opacity-0' : 'opacity-100'
      }
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
          {!userDead && !winner && <ActionsBox />}
          {winner && <RematchButton />}
        </div>
      </div>
      <div className="min-h-0 self-stretch xl:-mx-12">
        {!hasStarted || userDead || winner ? (
          <SimpleHexBoard board={boardWithBorders} boardSize={boardSize} />
        ) : (
          <HexagonalBoard />
        )}
      </div>
      <HelpBox className="sm:absolute sm:bottom-16 sm:right-4" />
    </div>
  );
};

export default GameDisplay;
