import {
  collection,
  limit,
  or,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';

import { Game } from 'functions/src/document-types/Games';

import Button from 'src/components/interactive/Button';
import StyledLink from 'src/components/interactive/StyledLink';
import { auth, firestore } from 'src/firebase/firebaseApp';
import { GameProvider } from 'src/game/game-context/GameContext';
import PastGame from 'src/pastgames/PastGame';

const pageSize = 10;

export default function PastGames() {
  const [user, userLoading] = useAuthState(auth);
  const router = useRouter();

  const [pagesToLoad, setPagesToLoad] = useState(1);
  const [pastGames, loading] = useCollection<Partial<Game>>(
    user &&
      query(
        collection(firestore, 'games'),
        or(
          where('players', 'array-contains', {
            id: user.uid,
            hasResigned: false,
          }),
          where('players', 'array-contains', {
            id: user.uid,
            hasResigned: true,
          }),
        ),
        orderBy('createdAt', 'desc'),
        limit(pageSize * pagesToLoad),
      ),
  );

  const showNoGamesText = !userLoading && !loading && pastGames?.size === 0;

  return (
    <>
      <Head>
        <title>HexFleet - Past Games</title>
      </Head>
      <div className="flex flex-1 flex-col items-center gap-6 p-8">
        {pastGames?.docs.map((doc) => {
          return (
            <GameProvider gameId={doc.id} key={doc.id}>
              <PastGame />
            </GameProvider>
          );
        })}
        {pastGames?.size === pageSize * pagesToLoad && (
          <Button
            className="mt-8"
            loading={loading}
            onClick={() => setPagesToLoad(pagesToLoad + 1)}>
            Load more
          </Button>
        )}
        <div
          className={`text-center transition-opacity ${
            showNoGamesText ? 'opacity-100' : 'opacity-0'
          }`}>
          <p>No past games.</p>
          <StyledLink onClick={() => void router.push('/')}>
            Want to create a new game?
          </StyledLink>
        </div>
      </div>
    </>
  );
}
