import { getWinRateString } from './getWinRateString';
import { GameOutcome } from 'functions/src/document-types/Score';

import PieChart from 'src/components/charts/PieChart';

export enum Period {
  PastWeek = 'Past Week',
  PastMonth = 'Past Month',
  AllTime = 'All Time',
}

const periodToEpoch = {
  [Period.PastWeek]: Date.now() - 7 * 24 * 60 * 60 * 1000,
  [Period.PastMonth]: Date.now() - 30 * 24 * 60 * 60 * 1000,
  [Period.AllTime]: 0,
};

const GameStatsRow = ({
  period,
  games,
}: {
  period: Period;
  games: GameOutcome[];
}) => {
  const relevantGames = games.filter(
    (game) =>
      game.timestamp && game.timestamp.toMillis() > periodToEpoch[period],
  );

  const total = relevantGames.length;
  const wins = relevantGames.filter((game) => game.won).length;
  const losses = total - wins;
  const winRate = getWinRateString(wins, losses);

  return (
    <div className="flex items-center">
      <p className="flex-1 text-left ">
        {period}: <b>{total}</b>
      </p>
      <div className="flex w-20 items-center justify-between">
        {total ? (
          <>
            <p>{winRate}</p>
            <PieChart
              data={[wins, losses]}
              dataColors={['stroke-green-500', 'stroke-zinc-600']}
              className="relative h-6 w-6"
            />
          </>
        ) : (
          <p className="flex-1 text-center">N/A</p>
        )}
      </div>
    </div>
  );
};

export default GameStatsRow;
