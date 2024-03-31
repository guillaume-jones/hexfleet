import { useContext } from 'react';
import { useHttpsCallable } from 'react-firebase-hooks/functions';

import { GameContext } from './game-context/GameContext';
import { StartGameData } from 'functions/src/document-types/Games';

import Button from 'src/components/interactive/Button';
import { functions } from 'src/firebase/firebaseApp';

const GameCodeBox = () => {
  const { shortId, gameId, players } = useContext(GameContext);

  const [startGame, loading] = useHttpsCallable<StartGameData>(
    functions,
    'startGame',
  );

  if (!shortId) return null;

  return (
    <div className="flex w-48 flex-col items-center gap-2 rounded-xl bg-violet-900 px-4 py-3 text-center">
      <h2 className="text-2xl font-semibold">Code: {shortId}</h2>
      {players.length < 2 && <p>Not enough players.</p>}
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
    </div>
  );
};

export default GameCodeBox;
