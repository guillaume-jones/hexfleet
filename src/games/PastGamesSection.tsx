import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  limit,
  or,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';

import { Game } from 'functions/src/document-types/Games';

import Button from 'src/components/interactive/Button';
import { auth, firestore } from 'src/firebase/firebaseApp';
import { GameProvider } from 'src/game/game-context/GameContext';
import PastGame from 'src/games/PastGame';

const pageSize = 10;

const PastGamesSection = () => {
  const [user] = useIdToken(auth);

  const [pagesToLoad, setPagesToLoad] = useState(1);
  const [pastGamesSnapshot, loading] = useCollection<Partial<Game>>(
    user &&
      query<Partial<Game>, Partial<Game>>(
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
      ),
  );

  // Avoid reloading the whole page when pagesToLoad changes
  const [pastGamesDocs, setPastGamesDocs] =
    useState<QueryDocumentSnapshot<Partial<Game>, DocumentData>[]>();
  useEffect(() => {
    if (!pastGamesSnapshot) return;
    setPastGamesDocs((prev) => {
      if (!prev) return pastGamesSnapshot.docs;
      return [...prev, ...pastGamesSnapshot.docs.slice(prev.length)];
    });
  }, [pastGamesSnapshot]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={'text-2xl font-semibold'}>Past Games</h2>

      {pastGamesDocs?.slice(0, pageSize * pagesToLoad).map((doc, i) => {
        return (
          <GameProvider gameId={doc.id} key={doc.id}>
            <PastGame
              index={i}
              removeGame={(gameId) =>
                setPastGamesDocs((prevDocs) =>
                  prevDocs?.filter((doc) => doc.id !== gameId),
                )
              }
            />
          </GameProvider>
        );
      })}

      <Button
        className={`transition-opacity delay-1000 duration-200 ${
          pastGamesDocs && pastGamesDocs.length > pageSize * pagesToLoad
            ? 'opacity-100'
            : 'opacity-0'
        }`}
        onClick={() => setPagesToLoad(pagesToLoad + 1)}>
        Load more
      </Button>
      <p
        className={`transition-opacity delay-200 ${
          !loading && !pastGamesDocs?.length ? 'opacity-100' : 'opacity-0'
        }`}>
        No past games to display.
      </p>
    </div>
  );
};

export default PastGamesSection;
