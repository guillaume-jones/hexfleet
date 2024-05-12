import { FirebaseError } from 'firebase/app';
import {
  GoogleAuthProvider,
  OAuthProvider,
  linkWithPopup,
  signInWithCredential,
  signInWithPopup,
} from 'firebase/auth';
import { useCallback, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import ProviderButton from './ProviderButton';

import { auth } from 'src/firebase/firebaseApp';

const provider = new GoogleAuthProvider();

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [user, userLoading] = useIdToken(auth);

  const login = useCallback(async () => {
    setLoading(true);

    if (user && user.isAnonymous) {
      try {
        await linkWithPopup(user, provider);
      } catch (error) {
        if (!(error instanceof FirebaseError)) {
          console.error(error);
          return;
        }

        const credential = OAuthProvider.credentialFromError(error);
        if (!credential) {
          console.error('Failed to create credential');
          return;
        }

        await signInWithCredential(auth, credential);
      }
    } else {
      await signInWithPopup(auth, provider);
    }

    setLoading(false);
  }, [user]);

  return (
    <ProviderButton
      loading={userLoading || loading}
      loginFunction={login}
      provider="Google"
    />
  );
};

export default GoogleLogin;
