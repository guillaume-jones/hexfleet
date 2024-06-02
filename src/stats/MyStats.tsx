import { doc } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import GameStatsRow, { Period } from './GameStatsRow';
import { GameType, Score } from 'functions/src/document-types/Score';

import Select from 'src/components/interactive/Select';
import LargeSpinner from 'src/components/other/LargeSpinner';
import { auth, firestore } from 'src/firebase/firebaseApp';

const MyStats = () => {
  const [user] = useIdToken(auth);
  const [userScore] = useDocumentData<Partial<Score>>(
    user && doc(firestore, 'scores', user.uid),
  );

  const [typeToShow, setTypeToShow] = useState<GameType>('1v1');

  const { games, longestStreak, lastTenGames } = useMemo(() => {
    const games =
      userScore?.pastGames?.filter((game) => game.type === typeToShow) ?? [];

    let longestStreak = 0;
    games.reduce((acc, game) => {
      if (game.won) {
        acc++;
        longestStreak = Math.max(acc, longestStreak);
      } else {
        acc = 0;
      }
      return acc;
    }, 0);

    const lastTenGames = games.slice(-10);

    return { longestStreak, lastTenGames, games };
  }, [userScore, typeToShow]);

  return (
    <div className="flex w-72 flex-col rounded-xl bg-zinc-900 p-4">
      <div className="mb-2 flex  items-center justify-between">
        <h2 className="text-xl font-semibold">My Stats</h2>
        <Select
          className="w-20"
          setValue={setTypeToShow}
          value={typeToShow}
          options={['1v1', 'FFA']}
        />
      </div>
      {!userScore && <LargeSpinner className="" />}
      {userScore && (
        <>
          <div className="flex justify-between pb-2 font-semibold">
            <p>Games Played</p>
            <p className=" w-20 text-center">Win Rate</p>
          </div>
          <div className="flex flex-col gap-2">
            <GameStatsRow period={Period.PastWeek} games={games} />
            <GameStatsRow period={Period.PastMonth} games={games} />
            <GameStatsRow period={Period.AllTime} games={games} />
          </div>
          <div className="pt-3">
            <p>Longest winning streak: {longestStreak}</p>
            <p>
              Last few games: {lastTenGames.filter((game) => game.won).length}{' '}
              in {lastTenGames.length}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default MyStats;
