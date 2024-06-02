import { ExtendedScore, LeaderboardType } from './leaderboardTypes';
import { calculateWr } from './leaderboardUtils';

import { getColorForPlayer } from 'src/game/board-view-utils/boardColors';

export const ScoreRow = ({
  score,
  i,
  isUser,
  onlyShowType,
}: {
  score: ExtendedScore;
  i?: number;
  isUser: boolean;
  onlyShowType?: LeaderboardType;
}) => {
  const wr1v1 = calculateWr(score.wins1v1, score.losses1v1)
    ?.toFixed(3)
    .slice(1);
  const wrFFA = calculateWr(score.winsFFA, score.lossesFFA)
    ?.toFixed(3)
    .slice(1);
  const elo1v1 = score.elo1v1?.toFixed(0);
  const eloFFA = score.eloFFA?.toFixed(0);

  const cellClassName = 'w-14';

  return (
    <div
      key={score.id}
      className={`flex gap-2 rounded-md py-1.5 ${
        isUser ? 'bg-violet-500 bg-opacity-25 font-bold' : ''
      }`}>
      <div className="flex">
        <p
          style={{ color: getColorForPlayer(score.id) }}
          className="w-8 pl-2 text-left">
          {i !== undefined ? `${i + 1}.` : ''}
        </p>
        <p
          style={{ color: getColorForPlayer(score.id) }}
          className="w-36 overflow-hidden overflow-ellipsis text-nowrap text-left">
          {score.name}
        </p>
      </div>
      {onlyShowType !== 'FFA' && (
        <div className="flex gap-1">
          <p className={cellClassName}>{elo1v1 ?? ''}</p>
          <p className={cellClassName}>{score.wins1v1 || ''}</p>
          <p className={cellClassName}>{wr1v1 ?? ''}</p>
        </div>
      )}
      {onlyShowType !== '1v1' && (
        <div className="flex gap-1">
          <p className={cellClassName}>{eloFFA ?? ''}</p>
          <p className={cellClassName}>{score.winsFFA || ''}</p>
          <p className={cellClassName}>{wrFFA ?? ''}</p>
        </div>
      )}
    </div>
  );
};
