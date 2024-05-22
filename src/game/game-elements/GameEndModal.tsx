import { GameContext } from '../game-context/GameContext';
import { useContext, useEffect, useState } from 'react';

import RematchButton from './RematchButton';

import Modal from 'src/components/containers/Modal';
import Button from 'src/components/interactive/Button';

const GameEndModal = () => {
  const { winner, userId, nextTurn, gameId } = useContext(GameContext);

  const [wasPlaying, setWasPlaying] = useState(false);
  const [open, setOpen] = useState<boolean | undefined>();

  useEffect(() => {
    if (nextTurn) setWasPlaying(true);
  }, [nextTurn]);

  useEffect(() => {
    if (wasPlaying && !!winner) {
      // Won't open twice after being closed
      setOpen((prev) => (prev === false ? false : true));
    }
  }, [wasPlaying, winner]);

  useEffect(() => {
    // Closes popup if game id changes
    setOpen(undefined);
  }, [gameId]);

  const isWinner = winner === userId;

  return (
    <Modal open={!!open} setOpen={setOpen}>
      <div className="flex w-72 flex-col gap-4">
        <h1
          className={`text-3xl font-bold ${
            isWinner ? 'text-violet-700' : 'text-zinc-400'
          }`}>
          {isWinner ? 'Victory!' : 'Defeat'}
        </h1>
        <p>
          {isWinner
            ? 'Your ships have conquered this galaxy. No enemies remain standing.'
            : 'You were unable to resist your foes. Perhaps another galaxy beckons?'}
        </p>
        <div className="flex justify-between">
          <RematchButton />
          <Button light onClick={() => setOpen(false)}>
            View board
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GameEndModal;
