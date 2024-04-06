import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useHttpsCallable } from 'react-firebase-hooks/functions';

import RejoinButton from './RejoinButton';
import { JoinGameData } from 'functions/src/document-types/Games';
import { shortIdLength } from 'functions/src/game-functions/shortId';

import Button from 'src/components/interactive/Button';
import Input from 'src/components/interactive/Input';
import { auth, functions } from 'src/firebase/firebaseApp';
import { loginUrlQuery } from 'src/layout/navbar/AccountButton';

type GameCreationProps = {
  className?: string;
};

const GameJoining = ({ className }: GameCreationProps) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [shortId, setShortId] = useState('');
  const [errorShown, setErrorShown] = useState(false);
  const [joinGame, loading] = useHttpsCallable<JoinGameData>(
    functions,
    'joinGame',
  );

  const joinGameAndRedirect = useCallback(
    async (id: string) => {
      if (!user) {
        await router.push(`/${loginUrlQuery}`);
        return;
      }
      const result = await joinGame({ shortId: id });
      if (result && typeof result.data === 'string') {
        await router.push(`/games/${result.data}`);
      } else {
        setErrorShown(true);
      }
    },
    [joinGame, router, user],
  );

  useEffect(() => {
    const shortId = router.query.shortId;
    if (user && shortId && typeof shortId === 'string') {
      setShortId(shortId.toUpperCase());
      void joinGameAndRedirect(shortId.toUpperCase());
    }
  }, [joinGameAndRedirect, router.query, user]);

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
        fontClassName="text-lg font-semibold"
        loading={loading}
        onClick={() => void joinGameAndRedirect(shortId)}>
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
