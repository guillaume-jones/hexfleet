import { getColorForPlayer } from '../board-view-utils/boardColors';
import { GameContext } from '../game-context/GameContext';
import { useContext } from 'react';

const PlayersBox = () => {
  const { players, pastTurns, tilesByPlayer, influenceByPlayer, winner } =
    useContext(GameContext);

  if (!players || !pastTurns) return null;

  return (
    <div className="flex w-80 flex-col rounded-xl bg-zinc-900 px-4 py-3 text-center">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Scores</h2>
        <p className="text-lg font-semibold">Turn: {pastTurns.length}</p>
      </div>
      <table className="text-center">
        <thead>
          <tr>
            <th className="w-40 text-left font-normal">Player</th>
            <th className="w-16 font-normal">Tiles</th>
            <th className="font-normal">Influence</th>
          </tr>
        </thead>
        <tbody>
          {players.map(({ id, name, hasResigned }) => (
            <tr
              className={`${hasResigned ? 'opacity-50' : ''}`}
              key={id}
              style={{ color: getColorForPlayer(id) }}>
              <th className="flex w-40 items-center gap-1" key={id}>
                <p
                  style={{ color: getColorForPlayer(id) }}
                  className={'overflow-hidden overflow-ellipsis text-nowrap'}>
                  {name}
                </p>
                {id === winner && (
                  <p className="text h-6 w-6 rounded-full bg-violet-800 align-top text-xs font-bold leading-6 text-white">
                    W
                  </p>
                )}
              </th>
              <td>{tilesByPlayer[id] ?? 0}</td>
              <td>{influenceByPlayer[id] ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayersBox;
