import { doc } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import GameStatsRow, { Period } from './GameStatsRow';
import { getLongestWinStreak, getMostGamesInADay } from './getGameHighScores';
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

  const { games, longestStreak, mostInADay } = useMemo(() => {
    const games =
      userScore?.pastGames?.filter((game) => game.type === typeToShow) ?? [];

    return {
      games,
      longestStreak: getLongestWinStreak(games),
      mostInADay: getMostGamesInADay(games),
    };
  }, [userScore, typeToShow]);

  return (
    <div className="flex w-72 flex-col rounded-xl bg-zinc-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Stats</h2>
        <Select
          className="w-20"
          setValue={setTypeToShow}
          value={typeToShow}
          options={['1v1', 'FFA']}
        />
      </div>
      <div
        className={`${
          userScore ? 'opacity-100' : 'h-0 opacity-0'
        } transition-all duration-100`}>
        <div className="flex justify-between pb-2 font-semibold">
          <p>Games Played</p>
          <p className=" w-20 text-center">Win Rate</p>
        </div>
        <div className="flex flex-col gap-1">
          <GameStatsRow period={Period.PastWeek} games={games} />
          <GameStatsRow period={Period.PastMonth} games={games} />
          <GameStatsRow period={Period.AllTime} games={games} />
        </div>
        <div className="flex flex-col gap-1 pt-4">
          <p className="font-semibold">Records</p>
          <p>Longest winning streak: {longestStreak}</p>
          <p>Most games in a single day: {mostInADay}</p>
        </div>
      </div>
      {!userScore && (
        <LargeSpinner className="flex h-52 w-full items-center justify-center" />
      )}
    </div>
  );
};

export default MyStats;
