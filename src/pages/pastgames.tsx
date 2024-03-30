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
import LargeSpinner from 'src/components/other/LargeSpinner';
import { auth, firestore } from 'src/firebase/firebaseApp';
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

  return (
    <>
      <Head>
        <title>HexFleet - Past Games</title>
      </Head>
      <div className="flex flex-1 flex-col items-center gap-4 p-8">
        {userLoading && <LargeSpinner />}
        {pastGames?.size === 0 && (
          <>
            <p>No past games.</p>
            <StyledLink onClick={() => void router.push('/')}>
              Want to create a new game?
            </StyledLink>
          </>
        )}
        {pastGames?.docs.map((doc) => {
          return (
            <PastGame key={doc.id} gameId={doc.id} game={doc.data() as Game} />
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
      </div>
    </>
  );
}
