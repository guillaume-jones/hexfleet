import { getColorForPlayer } from '../board-view-utils/boardColors';
import { GameContext } from '../game-context/GameContext';
import {
  CheckCircleIcon,
  EllipsisHorizontalCircleIcon,
  MinusCircleIcon,
} from '@heroicons/react/20/solid';
import { useContext } from 'react';

import WinnerChip from './WinnerChip';

import Tooltip from 'src/components/interactive/Tooltip';

const PlayersBox = () => {
  const {
    players,
    tilesByPlayer,
    influenceByPlayer,
    influenceByPlayerWithoutDisabled,
    winner,
  } = useContext(GameContext);

  if (!players) return null;

  return (
    <div className="flex w-96 flex-col rounded-xl bg-zinc-900 px-4 py-3 text-center">
      <h2 className="text-xl font-bold">Scores</h2>
      <div className="flex flex-col items-stretch ">
        <div className="flex gap-2">
          <p className="flex-1 text-left">Player</p>
          <p className="w-12">Sent</p>
          <p className="w-12">Tiles</p>
          <p className="w-16">Influence</p>
        </div>
        {players.map(({ id, name, dead, sent }) => {
          const color = getColorForPlayer(id);
          return (
            <div
              key={id}
              className={`flex items-center gap-2 ${dead ? 'opacity-60' : ''}`}
              style={{ color }}>
              <div className="flex flex-1 items-center gap-2" key={id}>
                <p
                  style={{ color }}
                  className={`
                ${dead ? 'line-through' : ''}
                  max-w-36 overflow-hidden overflow-ellipsis text-nowrap text-left
                `}>
                  {name}
                </p>
                {id === winner && <WinnerChip />}
              </div>
              {sent ? (
                <CheckCircleIcon className="h-5 w-12 text-green-500" />
              ) : dead || winner ? (
                <MinusCircleIcon className="h-5 w-12 text-zinc-600" />
              ) : (
                <EllipsisHorizontalCircleIcon className="h-5 w-12 text-red-500" />
              )}
              <p className="w-12">{tilesByPlayer[id] ?? 0}</p>
              <div className="group relative flex w-16 items-center justify-center">
                {dead ? (
                  <p>-</p>
                ) : (
                  <>
                    <p>{influenceByPlayer[id] ?? 0}</p>
                    <p className=" ml-0.5 text-xs">
                      /{influenceByPlayerWithoutDisabled[id] ?? 0}
                    </p>
                    <Tooltip className="-left-12 -right-12 w-auto text-black opacity-100">
                      Influence / influence without disabled
                    </Tooltip>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayersBox;
