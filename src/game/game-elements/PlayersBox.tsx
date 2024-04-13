import { getColorForPlayer } from '../board-view-utils/boardColors';
import { GameContext } from '../game-context/GameContext';
import { useContext } from 'react';

import Tooltip from 'src/components/interactive/Tooltip';

const PlayersBox = () => {
  const {
    players,
    pastTurns,
    tilesByPlayer,
    influenceByPlayer,
    influenceByPlayerWithoutDisabled,
    winner,
  } = useContext(GameContext);

  if (!players || !pastTurns) return null;

  return (
    <div className="flex w-80 flex-col rounded-xl bg-zinc-900 px-4 py-3 text-center">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Scores</h2>
        <p className="text-lg font-semibold">Turn: {pastTurns.length}</p>
      </div>
      <div className="flex flex-col items-stretch ">
        <div className="flex gap-2">
          <p className="flex-1 text-left font-normal">Player</p>
          <p className="w-10 font-normal">Tiles</p>
          <p className="w-16 font-normal">Influence</p>
        </div>
        {players.map(({ id, name, hasResigned }) => {
          const color = getColorForPlayer(id);
          return (
            <div
              key={id}
              className={`flex gap-2 ${hasResigned ? 'opacity-60' : ''}`}
              style={{ color }}>
              <div className="flex flex-1 items-center gap-2" key={id}>
                <p
                  style={{ color }}
                  className={`
                ${hasResigned ? 'line-through' : ''}
                  max-w-32 overflow-hidden overflow-ellipsis text-nowrap text-left
                `}>
                  {name}
                </p>
                {id === winner && (
                  <p className="group relative h-5 w-5 rounded-full bg-violet-800 text-xs font-semibold leading-5 text-white">
                    W
                    <Tooltip className="-left-10 -right-10 w-auto text-black opacity-100">
                      Winner
                    </Tooltip>
                  </p>
                )}
              </div>
              <p className="w-10">{tilesByPlayer[id] ?? 0}</p>
              <div className="group relative flex w-16 items-center justify-center">
                {hasResigned ? (
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
