import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import {
  collection,
  doc,
  limit,
  or,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';

import { Score } from 'functions/src/document-types/Score';

import Select from 'src/components/interactive/Select';
import LargeSpinner from 'src/components/other/LargeSpinner';
import { auth, firestore } from 'src/firebase/firebaseApp';
import { getNameForId } from 'src/game/board-view-utils/addNamesToPlayers';
import TableHeaderForType from 'src/leaderboard/LeaderboardTableHeader';
import { ScoreRow } from 'src/leaderboard/ScoreRow';
import {
  ExtendedScore,
  LeaderboardType,
  PossibleOrderField,
} from 'src/leaderboard/leaderboardTypes';
import { sortScores } from 'src/leaderboard/leaderboardUtils';

const maxScores = 99;

export default function Leaderboard() {
  const [user] = useIdToken(auth);
  const [scoresDocs] = useCollection<Partial<Score>>(
    query<Partial<Score>, Partial<Score>>(
      collection(firestore, 'scores'),
      or(where('wins1v1', '>', 0), where('winsFFA', '>', 0)),
      orderBy('elo1v1', 'desc'),
      limit(maxScores),
    ),
  );
  const [userScore] = useDocument<Partial<Score>>(
    user && doc(firestore, 'scores', user.uid),
  );

  const [orderField, setOrderField] = useState<PossibleOrderField>('elo1v1');
  const [scores, setScores] = useState<ExtendedScore[]>();
  const [typeToShow, setTypeToShow] = useState<LeaderboardType>('1v1');

  useEffect(() => {
    const asyncFunction = async () => {
      if (!scoresDocs) return;

      const newScores = await Promise.all(
        scoresDocs?.docs.map(async (doc) => ({
          ...doc.data(),
          id: doc.id,
          name: await getNameForId(doc.id),
        })),
      );

      sortScores(newScores, orderField);

      if (userScore && !newScores.find((score) => score.id === userScore.id)) {
        newScores.push({
          ...userScore,
          id: userScore.id,
          name: await getNameForId(userScore.id),
        });
      }

      setScores(newScores);
    };

    asyncFunction().catch(console.error);
  }, [scoresDocs, orderField, userScore]);

  const extendedUserScore = scoresDocs && scores?.at(scoresDocs.size);

  return (
    <>
      <Head>
        <title>HexFleet - Leaderboard</title>
      </Head>
      <div className="flex flex-1 flex-col items-center gap-4 p-8 pt-4 text-center">
        <div className="flex max-w-2xl items-center gap-3 rounded-xl bg-zinc-800 p-2 text-xl font-semibold">
          <h2 className="w-48">Name</h2>
          <div className="flex flex-col items-center gap-2 sm:hidden">
            <Select
              className="w-20"
              setValue={(value) => {
                setTypeToShow(value);
                setOrderField(
                  (prev) => (prev.slice(0, -3) + value) as PossibleOrderField,
                );
              }}
              value={typeToShow}
              options={['1v1', 'FFA']}
            />
            <TableHeaderForType
              type={typeToShow}
              orderField={orderField}
              setOrderField={setOrderField}
              hideTitle
            />
          </div>
          <div className="hidden gap-3 sm:flex">
            <TableHeaderForType
              type="1v1"
              orderField={orderField}
              setOrderField={setOrderField}
            />
            <TableHeaderForType
              type="FFA"
              orderField={orderField}
              setOrderField={setOrderField}
            />
          </div>
        </div>
        {scores && (
          <>
            <div className="hidden flex-col rounded-xl bg-zinc-900 p-2 sm:flex">
              {scores.slice(0, scoresDocs?.size).map((score, i) => (
                <ScoreRow
                  i={i}
                  key={score.id}
                  score={score}
                  isUser={score.id === user?.uid}
                />
              ))}
              {extendedUserScore && (
                <>
                  <EllipsisHorizontalIcon className="h-8 w-8 self-center" />
                  <ScoreRow score={extendedUserScore} isUser />
                </>
              )}
            </div>
            <div className="flex flex-col rounded-xl bg-zinc-900 p-2 sm:hidden">
              {scores.slice(0, scoresDocs?.size).map((score, i) => (
                <ScoreRow
                  i={i}
                  key={score.id}
                  score={score}
                  isUser={score.id === user?.uid}
                  onlyShowType={typeToShow}
                />
              ))}
              {extendedUserScore && (
                <>
                  <EllipsisHorizontalIcon className="h-8 w-8 self-center" />
                  <ScoreRow
                    score={extendedUserScore}
                    isUser
                    onlyShowType={typeToShow}
                  />
                </>
              )}
            </div>
          </>
        )}
        {!scores && <LargeSpinner className="mt-8" />}
      </div>
    </>
  );
}
