import { useAuthState } from 'react-firebase-hooks/auth';

import Button from 'src/components/interactive/Button';
import { auth } from 'src/firebase/firebaseApp';

function LoginButton({ pathName }: { pathName: string }) {
  const [user, userLoading] = useAuthState(auth);
  const showAsLoggedIn = !!user || userLoading;

  return (
    <>
      {showAsLoggedIn ? (
        <Button
          href="/account"
          className="ml-2 whitespace-nowrap rounded-full px-4 py-2"
          fixedActive={pathName === '/account'}
          light
          loading={userLoading}
          fontClassName="font-bold">
          Account
        </Button>
      ) : (
        <Button
          href="/login"
          className="ml-2 whitespace-nowrap rounded-full px-4 py-2"
          fixedActive={pathName === '/login'}
          light
          loading={userLoading}
          fontClassName="font-bold">
          Sign up or log in
        </Button>
      )}
    </>
  );
}

export default LoginButton;
