import { useContext } from 'react';

import { GameContext } from './GameContext';
import { getColorForPlayer } from './utils/boardColors';

const ScoreBox = () => {
  const { players, pastTurns, tilesByPlayer, influenceByPlayer } =
    useContext(GameContext);

  if (!players || !pastTurns) return null;

  return (
    <div className="flex w-72 flex-col rounded-xl bg-zinc-800 px-4 py-3 text-center">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Scores</h2>
        <p className="text-lg font-semibold">Turn: {pastTurns.length}</p>
      </div>
      <table className="text-center">
        <thead>
          <tr>
            <th className="w-32 text-left">Player</th>
            <th className="w-20 font-normal">Tiles</th>
            <th className="w-16 font-normal">Influence</th>
          </tr>
        </thead>
        <tbody>
          {players.map(({ id }) => (
            <tr key={id} style={{ color: getColorForPlayer(id) }}>
              <th className="text-left font-semibold">{id}</th>
              <td>{tilesByPlayer[id] ?? 0}</td>
              <td>{influenceByPlayer[id] ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreBox;
