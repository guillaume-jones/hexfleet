import { getColorForPlayer } from '../board-view-utils/boardColors';
import { GameContext } from '../game-context/GameContext';
import { useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from 'src/firebase/firebaseApp';

const PlayersBox = () => {
  const [user] = useAuthState(auth);
  const { players, pastTurns, tilesByPlayer, influenceByPlayer, winner } =
    useContext(GameContext);

  if (!players || !pastTurns) return null;

  return (
    <div className="flex w-80 flex-col rounded-xl bg-zinc-800 px-4 py-3 text-center">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Scores</h2>
        <p className="text-lg font-semibold">Turn: {pastTurns.length}</p>
      </div>
      <table className="text-center">
        <thead>
          <tr>
            <th className="w-36 text-left">Player</th>
            <th className="w-16 font-normal">Tiles</th>
            <th className="font-normal">Influence</th>
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
                {id === winner ? ' (Won)' : ''}
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
