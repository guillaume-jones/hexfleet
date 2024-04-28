import { GameContext } from '../game-context/GameContext';
import { useContext } from 'react';
import { RotateCcw } from 'react-feather';

import Range from 'src/components/interactive/Range';

type TurnBoxProps = {
  className?: string;
};

const TurnBox = ({ className }: TurnBoxProps) => {
  const { pastTurns, setTurn, turn, winner, isInPast } =
    useContext(GameContext);

  return (
    <div
      className={`flex select-none flex-col gap-2 rounded-xl bg-zinc-900 px-4 py-3
  transition-all ${className}
  `}>
      <h2 className="text-xl font-bold">Turns</h2>
      <div className="flex h-8 items-center justify-between">
        <p>
          {isInPast || winner ? 'Showing turn: ' : 'Current turn: '}
          {turn}
        </p>
        <RotateCcw
          className={`ml-2 transition-opacity  ${
            isInPast
              ? 'cursor-pointer hover:opacity-80 active:opacity-50'
              : 'opacity-0 hover:opacity-0'
          }`}
          size={20}
          onClick={() => setTurn(pastTurns?.length ?? 0)}
        />
      </div>
      {pastTurns && pastTurns.length > 0 && (
        <Range
          min={0}
          max={pastTurns.length}
          value={turn}
          setValue={setTurn}
          className={`mb-2 w-44 ${
            isInPast ? 'cursor-pointer' : 'cursor-not-allowed'
          }`}
        />
      )}
    </div>
  );
};

export default TurnBox;
