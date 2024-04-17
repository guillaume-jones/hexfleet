import CreateNewGame from '../create-game/CreateNewGame';
import { useState } from 'react';

import Modal from 'src/components/containers/Modal';
import Button from 'src/components/interactive/Button';

const RematchButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Start a new game</Button>
      <Modal open={open} setOpen={setOpen} className="flex flex-col gap-2">
        <CreateNewGame onCancel={() => setOpen(false)} />
      </Modal>
    </>
  );
};

export default RematchButton;
