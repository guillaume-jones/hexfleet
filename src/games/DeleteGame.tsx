import { TrashIcon } from '@heroicons/react/20/solid';
import { deleteDoc, doc } from 'firebase/firestore';
import { useState } from 'react';

import Modal from 'src/components/containers/Modal';
import Button from 'src/components/interactive/Button';
import { firestore } from 'src/firebase/firebaseApp';

type DeleteGameProps = {
  gameId: string;
};

const DeleteGame = ({ gameId }: DeleteGameProps) => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  return (
    <>
      <button
        className="outline-none"
        onClick={() => setConfirmModalOpen(true)}>
        <TrashIcon className="h-8 w-8 text-red-500 transition-all sm:hover:text-red-600 sm:active:text-red-700" />
      </button>
      <Modal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        showX={false}>
        <p>Are you sure you want to delete this game?</p>
        <div className="mt-4 flex justify-around self-center">
          <Button light onClick={() => setConfirmModalOpen(false)}>
            Cancel
          </Button>
          <Button
            danger
            onClick={() => {
              setConfirmModalOpen(false);
              deleteDoc(doc(firestore, 'games', gameId)).catch(console.error);
            }}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DeleteGame;
