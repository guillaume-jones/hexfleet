import { GameContext } from '../game-context/GameContext';
import { useContext } from 'react';
import { RotateCcw } from 'react-feather';

import Range from 'src/components/interactive/Range';

type TurnBoxProps = {
  className?: string;
};

const TurnBox = ({ className }: TurnBoxProps) => {
  const { pastTurns, setTurn, turn, winner } = useContext(GameContext);

  const isInPast = turn < (pastTurns?.length ?? 0);

  return (
    <div
      className={`flex w-44 flex-col gap-2 rounded-xl bg-zinc-900 px-4 py-3
  transition-all ${className}
  `}>
      <h2 className="text-xl font-bold">Turns</h2>
      <p>
        {isInPast || winner ? 'Showing turn: ' : 'Current turn: '}
        {turn}
      </p>
      {pastTurns && pastTurns.length > 0 && (
        <div className="flex h-6 items-center">
          <Range
            min={0}
            max={pastTurns.length}
            value={turn}
            setValue={setTurn}
          />
          <RotateCcw
            className={`ml-2 transition-opacity  ${
              isInPast
                ? 'cursor-pointer hover:opacity-80 active:opacity-50'
                : 'opacity-0 hover:opacity-0'
            }`}
            size={20}
            onClick={() => setTurn(pastTurns.length)}
          />
        </div>
      )}
    </div>
  );
};

export default TurnBox;
