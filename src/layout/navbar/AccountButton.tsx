import { useCallback, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import Modal from 'src/components/containers/Modal';
import Button from 'src/components/interactive/Button';
import { auth } from 'src/firebase/firebaseApp';
import Login from 'src/pages/login';

function AccountButton() {
  const [user, userLoading] = useAuthState(auth);
  const loggedIn = !!user || userLoading;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), [setIsModalOpen]);
  const closeModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);

  return (
    <>
      <Button
        href={loggedIn ? '/account' : undefined}
        onClick={loggedIn ? undefined : openModal}
        className="ml-2 whitespace-nowrap rounded-full px-4 py-2"
        fontClassName="font-bold"
        loading={userLoading}>
        {loggedIn ? 'Account' : 'Sign up or log in'}
      </Button>
      <Modal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title="Sign up or log in">
        <Login onSuccess={closeModal} />
      </Modal>
    </>
  );
}

export default AccountButton;
