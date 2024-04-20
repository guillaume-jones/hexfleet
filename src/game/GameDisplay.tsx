import React, { useContext } from 'react';

import HexagonalBoard from './board/HexagonalBoard';
import SimpleHexBoard from './board/SimpleHexBoard';
import { GameContext } from './game-context/GameContext';
import ActionsBox from './game-elements/ActionsBox';
import GameCodeBox from './game-elements/GameCodeBox';
import GameEndModal from './game-elements/GameEndModal';
import HelpBox from './game-elements/HelpBox';
import PlayersBox from './game-elements/PlayersBox';
import RematchButton from './game-elements/RematchButton';
import TurnBox from './game-elements/TurnBox';

const GameDisplay = () => {
  const { loading, hasStarted, userDead, projectedBoard, boardSize, winner } =
    useContext(GameContext);

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
        // Ensures board fits into window height
        'h-auto sm:-mb-10 sm:h-full sm:flex-none sm:pb-14'
      } 
     `}>
      <div
        className="flex flex-col items-center gap-4 lg:flex-row xl:flex-col xl:items-start
      ">
        <PlayersBox />
        {hasStarted ? <TurnBox /> : <GameCodeBox />}
        <div className="hidden flex-1 xl:block" />
        {userDead || winner ? <RematchButton /> : <ActionsBox />}
      </div>
      <div className="flex min-h-0 min-w-80 flex-col items-center self-stretch xl:-mx-10">
        {!hasStarted || userDead || winner ? (
          <SimpleHexBoard board={projectedBoard} boardSize={boardSize} />
        ) : (
          <HexagonalBoard />
        )}
      </div>
      <HelpBox className="sm:absolute sm:bottom-16 sm:right-4" />
      <GameEndModal />
    </div>
  );
};

export default GameDisplay;
