import { signInAnonymously } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useHttpsCallable } from 'react-firebase-hooks/functions';

import { JoinGameData } from 'functions/src/game-functions/functionInputs';
import { shortIdLength } from 'functions/src/game-logic/GameConstants';

import Button from 'src/components/interactive/Button';
import Input from 'src/components/interactive/Input';
import { auth, functions } from 'src/firebase/firebaseApp';

type GameJoiningProps = {
  className?: string;
};

const GameJoining = ({ className }: GameJoiningProps) => {
  const [user, userLoading] = useIdToken(auth);
  const router = useRouter();

  const [shortId, setShortId] = useState('');
  const [errorShown, setErrorShown] = useState(false);
  const [joinGame, loading] = useHttpsCallable<JoinGameData>(
    functions,
    'httpsCallable',
  );

  const joinGameAndRedirect = useCallback(
    (id: string) => {
      if (userLoading) return;

      const asyncFunction = async () => {
        if (!user) await signInAnonymously(auth);
        const result = await joinGame({ shortId: id });
        if (result && typeof result.data === 'string') {
          void router.push(`/game?id=${result.data}`);
        } else {
          throw new Error('Did not receive a game id.');
        }
      };

      asyncFunction().catch((e) => {
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
    <div className={`flex w-56 flex-col items-center gap-4 ${className}`}>
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
      <div
        className={`transition-all ${
          errorShown ? 'h-10 opacity-100' : 'h-0 opacity-0'
        }`}>
        <p className="text-red-500">No open game with this code.</p>
      </div>
    </div>
  );
};

export default GameJoining;
