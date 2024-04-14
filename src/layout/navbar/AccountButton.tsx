import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

import Modal from 'src/components/containers/Modal';
import Button from 'src/components/interactive/Button';
import { auth } from 'src/firebase/firebaseApp';
import Login from 'src/login/login';

function AccountButton() {
  const router = useRouter();
  const [user, userLoading] = useAuthState(auth);

  const loggedIn = !!user;
  const isModalOpen = !!router.query?.login;

  const replaceUrl = (open: boolean) => {
    const { login, ...newQuery } = router.query;
    if (!open) {
      void router.replace({ query: newQuery });
    } else {
      void router.replace({ query: { ...newQuery, login: true } });
    }
  };

  return (
    <>
      <Button
        href={loggedIn ? '/account' : undefined}
        onClick={loggedIn ? undefined : () => replaceUrl(true)}
        className="ml-2 whitespace-nowrap rounded-full px-4 py-2"
        fontClassName="font-bold"
        loading={userLoading}>
        {loggedIn ? 'Account' : 'Sign up or log in'}
      </Button>
      <Modal
        className="overflow-visible"
        open={isModalOpen}
        setOpen={(open) => replaceUrl(open)}
        title="Sign up or log in">
        <Login onSuccess={() => replaceUrl(false)} />
      </Modal>
    </>
  );
}

export default AccountButton;
