import CreateNewGame from '../create-game/CreateNewGame';
import { GameContext } from '../game-context/GameContext';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useHttpsCallable } from 'react-firebase-hooks/functions';

import { JoinGameData } from 'functions/src/game-functions/functionInputs';

import Modal from 'src/components/containers/Modal';
import Button from 'src/components/interactive/Button';
import { functions } from 'src/firebase/firebaseApp';

const RematchButton = () => {
  const router = useRouter();
  const { players, rematchId, wasPlaying } = useContext(GameContext);
  const [errorShown, setErrorShown] = useState(false);
  const [joinGame, loading] = useHttpsCallable<JoinGameData>(
    functions,
    'joinGame',
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (rematchId && wasPlaying) setOpen(true);
  }, [rematchId, wasPlaying]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {rematchId ? 'Join rematch' : 'Start a rematch'}
      </Button>
      <Modal open={open} setOpen={setOpen} className="flex flex-col gap-2">
        {rematchId ? (
          <div className="flex max-w-60 flex-col gap-2">
            <h3 className="text-xl font-semibold">Rematch</h3>
            <p>Another player has proposed a rematch. Will you accept?</p>
            <div className="mt-2 flex justify-between">
              <Button light onClick={() => setOpen(false)}>
                Ignore
              </Button>
              <Button
                loading={loading}
                onClick={() => {
                  const asyncFunction = async () => {
                    const result = await joinGame({ shortId: rematchId });

                    if (result && typeof result.data === 'string') {
                      void router.push(`/games/${result.data}`);
                    } else {
                      throw new Error('Failed to join rematch.');
                    }
                  };
                  asyncFunction().catch((e) => {
                    console.error(e);
                    setErrorShown(true);
                  });
                }}>
                Join Rematch
              </Button>
            </div>
            <div
              className={`transition-all ${
                errorShown ? 'h-4 opacity-100' : 'h-0 opacity-0'
              }`}>
              <p className="text-center text-red-500">
                Failed to join rematch.
              </p>
            </div>
          </div>
        ) : (
          <CreateNewGame
            onCancel={() => setOpen(false)}
            playerIds={players.map(({ id }) => id)}
          />
        )}
      </Modal>
    </>
  );
};

export default RematchButton;
