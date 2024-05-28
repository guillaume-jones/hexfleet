import { ChevronDownIcon } from '@heroicons/react/20/solid';
import {
  collection,
  limit,
  or,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import Head from 'next/head';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';

import { Score } from 'functions/src/document-types/Score';

import StyledLink from 'src/components/interactive/StyledLink';
import LargeSpinner from 'src/components/other/LargeSpinner';
import { auth, firestore } from 'src/firebase/firebaseApp';
import { getNameForId } from 'src/game/board-view-utils/addNamesToPlayers';
import { getColorForPlayer } from 'src/game/board-view-utils/boardColors';

type ExtendedScore = Partial<Score> & {
  name: string;
  color: string;
  id: string;
};

type PossibleOrderField =
  | 'elo1v1'
  | 'eloFFA'
  | 'wins1v1'
  | 'winsFFA'
  | 'ratio1v1'
  | 'ratioFFA';

export default function Leaderboard() {
  const [user] = useIdToken(auth);
  const [orderField, setOrderField] = useState<PossibleOrderField>('elo1v1');
  const [scores, setScores] = useState<ExtendedScore[]>();

  const [scoresDocs, scoresLoading] = useCollection<Partial<Score>>(
    query<Partial<Score>, Partial<Score>>(
      collection(firestore, 'scores'),
      or(where('wins1v1', '>', 0), where('winsFFA', '>', 0)),
      orderBy('elo1v1', 'desc'),
      limit(100),
    ),
  );

  useEffect(() => {
    const asyncFunction = async () => {
      if (!scoresDocs) return;

      const newScores = await Promise.all(
        scoresDocs?.docs.map(async (doc) => ({
          ...doc.data(),
          id: doc.id,
          name: await getNameForId(doc.id),
          color: getColorForPlayer(doc.id),
        })),
      );

      newScores.sort((a, b) => {
        if (orderField === 'ratio1v1') {
          return (
            (b.wins1v1 ?? 1) / (b.losses1v1 ?? 1) -
            (a.wins1v1 ?? 1) / (a.losses1v1 ?? 1)
          );
        } else if (orderField === 'ratioFFA') {
          return (
            (b.winsFFA ?? 1) / (b.lossesFFA ?? 1) -
            (a.winsFFA ?? 1) / (a.lossesFFA ?? 1)
          );
        } else {
          return (b[orderField] ?? 0) - (a[orderField] ?? 0);
        }
      });

      setScores(newScores);
    };

    asyncFunction().catch(console.error);
  }, [scoresDocs, orderField]);

  return (
    <>
      <Head>
        <title>HexFleet - Leaderboard</title>
      </Head>
      <div className="flex flex-1 flex-col items-center gap-4 p-8 pt-4">
        <div className="flex max-w-2xl items-center rounded-xl bg-zinc-800 py-2 text-center text-xl font-semibold">
          <h2 className="w-40">Name</h2>
          <TableHeaderForType
            type="1v1"
            orderField={orderField}
            setOrderField={setOrderField}
          />
          <TableHeaderForType
            className="hidden sm:block"
            type="FFA"
            orderField={orderField}
            setOrderField={setOrderField}
          />
        </div>
        <div className="flex flex-col gap-2 rounded-xl bg-zinc-900 py-4">
          {scores?.map((score) => {
            const ratio1v1 =
              score.wins1v1 && score.losses1v1
                ? (score.wins1v1 / score.losses1v1).toFixed(2)
                : '';
            const ratioFFA =
              score.winsFFA && score.lossesFFA
                ? (score.winsFFA / score.lossesFFA).toFixed(2)
                : '';
            const elo1v1String = score.elo1v1 ? score.elo1v1.toFixed(0) : '';
            const eloFFAString = score.eloFFA ? score.eloFFA.toFixed(0) : '';

            return (
              <div
                key={score.id}
                className={`flex text-center ${
                  score.id === user?.uid ? 'font-bold' : ''
                }`}>
                <p style={{ color: score.color }} className="w-40">
                  {score.name}
                </p>
                <div className="flex">
                  <p className="w-16 pr-4">{elo1v1String}</p>
                  <p className="w-16 pr-4">{score.wins1v1}</p>
                  <p className="w-16 pr-4">{ratio1v1}</p>
                </div>
                <div className="hidden sm:flex">
                  <p className="w-16 pr-4">{eloFFAString}</p>
                  <p className="w-16 pr-4">{score.winsFFA}</p>
                  <p className="w-16 pr-4">{ratioFFA}</p>
                </div>
              </div>
            );
          })}
        </div>
        {scoresLoading && <LargeSpinner />}
      </div>
    </>
  );
}

const SortableTableHeader = ({
  orderField,
  setOrderField,
  targetField,
  text,
}: {
  orderField: string;
  setOrderField: Dispatch<SetStateAction<PossibleOrderField>>;
  targetField: PossibleOrderField;
  text: string;
}) => {
  return (
    <StyledLink
      light
      active={orderField === targetField}
      className={`flex w-16 items-center justify-center ${
        orderField === targetField ? 'font-semibold' : ''
      }`}
      onClick={() => setOrderField(targetField)}>
      {text}
      <ChevronDownIcon
        className={`${
          orderField === targetField ? 'opacity-100' : 'opacity-0'
        } h-5 w-5 rounded-full  stroke-violet-600 stroke-1 transition-opacity`}
      />
    </StyledLink>
  );
};

const TableHeaderForType = ({
  type,
  orderField,
  setOrderField,
  className,
}: {
  type: '1v1' | 'FFA';
  orderField: PossibleOrderField;
  setOrderField: Dispatch<SetStateAction<PossibleOrderField>>;
  className?: string;
}) => {
  return (
    <div className={className}>
      <h2>{type}</h2>
      <div className="flex text-lg font-medium">
        <SortableTableHeader
          orderField={orderField}
          setOrderField={setOrderField}
          targetField={('elo' + type) as 'elo1v1'}
          text="Elo"
        />
        <SortableTableHeader
          orderField={orderField}
          setOrderField={setOrderField}
          targetField={('wins' + type) as 'wins1v1'}
          text="Wins"
        />
        <SortableTableHeader
          orderField={orderField}
          setOrderField={setOrderField}
          targetField={('ratio' + type) as 'ratio1v1'}
          text="W/L"
        />
      </div>
    </div>
  );
};
