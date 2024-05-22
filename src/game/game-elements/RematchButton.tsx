import CreateNewGame from '../create-game/CreateNewGame';
import { GameContext } from '../game-context/GameContext';
import { useContext, useState } from 'react';

import Modal from 'src/components/containers/Modal';
import Button from 'src/components/interactive/Button';

const RematchButton = () => {
  const { players } = useContext(GameContext);

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Start a rematch</Button>
      <Modal open={open} setOpen={setOpen} className="flex flex-col gap-2">
        <CreateNewGame
          onCancel={() => setOpen(false)}
          playerIds={players.map(({ id }) => id)}
        />
      </Modal>
    </>
  );
};

export default RematchButton;
