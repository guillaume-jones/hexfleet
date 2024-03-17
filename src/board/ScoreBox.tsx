import { Dictionary } from 'lodash';

import { getColorForPlayer } from './utils/boardColors';

const ScoreBox = ({
  playerIds,
  tilesByPlayer,
  influenceByPlayer,
}: {
  playerIds: string[];
  tilesByPlayer: Dictionary<number>;
  influenceByPlayer: Dictionary<number>;
}) => {
  return (
    <div className="flex w-64 flex-col rounded-xl bg-zinc-800 p-3">
      <h2 className="text-center text-2xl font-bold">Scores</h2>
      <table className="text-center">
        <thead>
          <tr>
            <th className="w-20" scope="col">
              Player
            </th>
            <th className="w-20" scope="col">
              Tiles
            </th>
            <th className="w-20" scope="col">
              Influence
            </th>
          </tr>
        </thead>
        <tbody>
          {playerIds.map((playerId) => (
            <tr key={playerId} style={{ color: getColorForPlayer(playerId) }}>
              <th scope="row">{playerId}</th>
              <td>{tilesByPlayer[playerId] ?? 0}</td>
              <td>{influenceByPlayer[playerId] ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreBox;
