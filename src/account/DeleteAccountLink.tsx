import { useCallback, useState } from 'react';
import { useDeleteUser } from 'react-firebase-hooks/auth';

import Modal from 'src/components/containers/Modal';
import Button from 'src/components/interactive/Button';
import { auth } from 'src/firebase/firebaseApp';

export default function DeleteAccountLink() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserAsync, deleteUserLoading] = useDeleteUser(auth);

  const deleteUser = useCallback(() => {
    deleteUserAsync()
      .then(() => {
        localStorage.clear();
      })
      .catch((e) => console.error(e));
  }, [deleteUserAsync]);

  const toggleModal = useCallback(() => {
    setShowDeleteModal((curr) => !curr);
  }, []);

  return (
    <>
      <button
        className="mr-1 appearance-none text-red-600 hover:text-red-500 active:text-red-700"
        onClick={toggleModal}>
        Delete account
      </button>
      <Modal
        open={showDeleteModal}
        setOpen={setShowDeleteModal}
        className="flex max-w-md flex-col gap-4">
        <h1 className="text-xl font-bold text-red-500">Delete account</h1>
        <div>
          <p>
            Are you sure you want to delete your account? Your data and
            purchases will be permanently removed.{' '}
          </p>
          <b>This action cannot be undone.</b>
        </div>
        <div className="flex gap-10 self-center">
          <Button danger onClick={deleteUser} loading={deleteUserLoading}>
            Delete Account
          </Button>
          <Button onClick={toggleModal}>Cancel</Button>
        </div>
      </Modal>
    </>
  );
}
