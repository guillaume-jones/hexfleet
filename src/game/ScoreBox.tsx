import { useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { getColorForPlayer } from './board-view-utils/boardColors';
import { GameContext } from './game-context/GameContext';

import { auth } from 'src/firebase/firebaseApp';

const ScoreBox = () => {
  const [user] = useAuthState(auth);
  const { players, pastTurns, tilesByPlayer, influenceByPlayer } =
    useContext(GameContext);

  if (!players || !pastTurns) return null;

  return (
    <div className="flex w-80 flex-col rounded-xl bg-zinc-800 px-4 py-3 text-center">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Scores</h2>
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
          {players.map(({ id, name, hasResigned }) => (
            <tr
              className={`${id === user?.uid ? 'font-semibold' : ''}
              ${hasResigned ? 'font-light opacity-50' : ''}`}
              key={id}
              style={{ color: getColorForPlayer(id) }}>
              <th
                className={`max-w-40 overflow-hidden overflow-ellipsis text-nowrap text-left ${
                  hasResigned ? 'font-light' : ''
                }`}>
                {name}
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

export default ScoreBox;
