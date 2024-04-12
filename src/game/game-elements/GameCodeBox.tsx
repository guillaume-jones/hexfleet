import { GameContext } from '../game-context/GameContext';
import { useContext, useState } from 'react';
import { Check, Copy } from 'react-feather';
import { useHttpsCallable } from 'react-firebase-hooks/functions';

import { StartGameData } from 'functions/src/document-types/Games';

import Button from 'src/components/interactive/Button';
import { functions } from 'src/firebase/firebaseApp';

const GameCodeBox = () => {
  const { shortId, gameId, players } = useContext(GameContext);

  const [startGame, loading] = useHttpsCallable<StartGameData>(
    functions,
    'startGame',
  );

  const [justCopied, setJustCopied] = useState(false);

  if (!shortId) return null;

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-violet-900 px-4 py-3 text-center">
      <div className="relative flex items-center gap-4">
        <h2 className="text-xl font-semibold">Code: {shortId}</h2>

        <Copy
          className={`z-[1] transition-opacity ${
            justCopied ? 'opacity-0' : 'cursor-pointer'
          }`}
          onClick={() => {
            setJustCopied(true);
            void navigator.clipboard.writeText(
              `www.hexfleet.com?shortId=${shortId}`,
            );
            setTimeout(() => setJustCopied(false), 1000);
          }}
        />
        <Check
          className={`absolute right-0 z-0 opacity-0 transition-opacity ${
            justCopied ? 'opacity-100' : ''
          }`}
        />
      </div>

      <Button
        light
        disabled={players.length < 2}
        loading={loading}
        onClick={() => {
          const asyncFunction = async () => startGame({ gameId });
          void asyncFunction();
        }}>
        Start Game
      </Button>
      {players.length < 2 && <p>Not enough players.</p>}
    </div>
  );
};

export default GameCodeBox;
