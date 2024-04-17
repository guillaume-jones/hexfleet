import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useHttpsCallable } from 'react-firebase-hooks/functions';

import RejoinButton from './RejoinButton';
import { JoinGameData } from 'functions/src/document-types/Games';
import { shortIdLength } from 'functions/src/game-logic/GameConstants';

import Button from 'src/components/interactive/Button';
import Input from 'src/components/interactive/Input';
import { auth, functions } from 'src/firebase/firebaseApp';

type GameCreationProps = {
  className?: string;
};

const GameJoining = ({ className }: GameCreationProps) => {
  const [user, userLoading] = useAuthState(auth);
  const router = useRouter();

  const [shortId, setShortId] = useState('');
  const [errorShown, setErrorShown] = useState(false);
  const [joinGame, loading] = useHttpsCallable<JoinGameData>(
    functions,
    'joinGame',
  );

  const joinGameAndRedirect = useCallback(
    (id: string) => {
      if (userLoading) return;
      if (!user) {
        void router.replace({
          query: { ...router.query, login: true },
        });
        return;
      }

      joinGame({ shortId: id })
        .then((result) => {
          if (result && typeof result.data === 'string') {
            void router.push(`/games/${result.data}`);
          } else {
            setErrorShown(true);
          }
        })
        .catch((e) => {
          console.error(e);
          setErrorShown(true);
        });
    },
    [joinGame, router, user, userLoading],
  );

  useEffect(() => {
    const shortId = router.query.shortId;
    if (typeof shortId !== 'string') return;

    setShortId(shortId.toUpperCase());
    joinGameAndRedirect(shortId.toUpperCase());
  }, [joinGameAndRedirect, router.query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (shortId && e.key === 'Enter') {
        e.preventDefault();
        joinGameAndRedirect(shortId.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [joinGameAndRedirect, shortId]);

  return (
    <div className={`flex w-60 flex-col items-center gap-4 ${className}`}>
      <Input
        className="w-40"
        value={shortId}
        setValue={(t) => setShortId(t.toUpperCase())}
        placeholder={'Enter 5-letter code'}
        inputProps={{
          maxLength: shortIdLength,
          onFocus: () => setErrorShown(false),
        }}
      />

      <Button
        disabled={shortId.length !== shortIdLength}
        fontClassName="text-lg font-semibold"
        loading={loading}
        onClick={() => joinGameAndRedirect(shortId)}>
        Join Game
      </Button>
      <p
        className={`text-red-500 transition-all ${
          errorShown ? 'opacity-100' : 'opacity-0'
        }`}>
        No open game with this code.
      </p>
      <RejoinButton />
    </div>
  );
};

export default GameJoining;
