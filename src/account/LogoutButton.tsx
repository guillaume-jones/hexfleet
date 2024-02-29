import { useCallback } from 'react';
import { useSignOut } from 'react-firebase-hooks/auth';

import Button from 'src/components/interactive/Button';
import { auth } from 'src/firebase/firebaseApp';

export default function LogoutButton() {
  const [signOutAsync, signOutLoading] = useSignOut(auth);

  const signOut = useCallback(() => {
    signOutAsync()
      .then(() => {
        localStorage.clear();
      })
      .catch((e) => console.error(e));
  }, [signOutAsync]);

  return (
    <Button onClick={signOut} loading={signOutLoading}>
      Log out
    </Button>
  );
}
