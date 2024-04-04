import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

import Modal from 'src/components/containers/Modal';
import Button from 'src/components/interactive/Button';
import { auth } from 'src/firebase/firebaseApp';
import Login from 'src/login/login';

export const loginUrlQuery = '?login=true';

function AccountButton() {
  const router = useRouter();
  const [user, userLoading] = useAuthState(auth);

  const loggedIn = !!user;
  const isModalOpen = !!router.query?.login;

  return (
    <>
      <Button
        href={loggedIn ? '/account' : undefined}
        onClick={
          loggedIn
            ? undefined
            : () => void router.push(`${router.basePath}${loginUrlQuery}`)
        }
        className="ml-2 whitespace-nowrap rounded-full px-4 py-2"
        fontClassName="font-bold"
        loading={userLoading}>
        {loggedIn ? 'Account' : 'Sign up or log in'}
      </Button>
      <Modal
        open={isModalOpen}
        setOpen={(open) =>
          void router.push(
            open ? `${router.basePath}${loginUrlQuery}` : router.basePath,
          )
        }
        title="Sign up or log in">
        <Login onSuccess={() => void router.push(router.basePath)} />
      </Modal>
    </>
  );
}

export default AccountButton;
