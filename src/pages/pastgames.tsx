import {
  QueryDocumentSnapshot,
  collection,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import { Game } from 'functions/src/document-types/Games';

import Button from 'src/components/interactive/Button';
import { auth, firestore } from 'src/firebase/firebaseApp';
import { GameProvider } from 'src/game/game-context/GameContext';
import GameCreation from 'src/landing/GameCreation';
import GameJoining from 'src/landing/GameJoining';
import AnonymousGameWarning from 'src/login/AnonymousGameWarning';
import PastGame from 'src/pastgames/PastGame';

const pageSize = 10;

export default function PastGames() {
  const [user] = useIdToken(auth);

  const [pagesToLoad, setPagesToLoad] = useState(1);
  const [pastGames, setPastGames] =
    useState<QueryDocumentSnapshot<Partial<Game>, Partial<Game>>[]>();

  useEffect(() => {
    if (!user) return;

    // Get collection using limit and query
    const q = query<Partial<Game>, Partial<Game>>(
      collection(firestore, 'games'),
      or(
        where('players', 'array-contains', {
          id: user.uid,
          dead: false,
          sent: false,
        }),
        where('players', 'array-contains', {
          id: user.uid,
          dead: false,
          sent: true,
        }),
        where('players', 'array-contains', {
          id: user.uid,
          dead: true,
          sent: false,
        }),
        where('players', 'array-contains', {
          id: user.uid,
          dead: true,
          sent: true,
        }),
      ),
      orderBy('createdAt', 'desc'),
      limit(pageSize * pagesToLoad + 1),
    );

    getDocs(q)
      .then((snapshot) => {
        setPastGames(snapshot.docs);
      })
      .catch(console.error);
  }, [pagesToLoad, user]);

  return (
    <>
      <Head>
        <title>HexFleet - Past Games</title>
      </Head>
      <div className="flex flex-1 flex-col items-center gap-6 p-8">
        <AnonymousGameWarning />
        <div
          className={
            'flex flex-col justify-center gap-10 sm:flex-row sm:gap-0'
          }>
          <GameCreation />
          <GameJoining />
        </div>

        {pastGames?.slice(0, pageSize * pagesToLoad).map((doc, i) => {
          return (
            <GameProvider gameId={doc.id} key={doc.id}>
              <PastGame index={i} />
            </GameProvider>
          );
        })}
        {pastGames && pastGames.length > pageSize * pagesToLoad && (
          <Button
            className="mt-8"
            onClick={() => setPagesToLoad(pagesToLoad + 1)}>
            Load more
          </Button>
        )}
        {pastGames?.length === 0 && <p>No past games to display.</p>}
      </div>
    </>
  );
}
