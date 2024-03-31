import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useHttpsCallable } from 'react-firebase-hooks/functions';

import RejoinButton from './RejoinButton';
import { JoinGameData } from 'functions/src/document-types/Games';
import { shortIdLength } from 'functions/src/game/shortId';

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
        onClick={() => {
          const asyncFunction = async () => {
            if (!user) {
              await router.push(`/${loginUrlQuery}`);
              return;
            }
            const result = await joinGame({ shortId });
            if (result && typeof result.data === 'string') {
              await router.push(`/games/${result.data}`);
            } else {
              setErrorShown(true);
            }
          };
          void asyncFunction();
        }}>
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
