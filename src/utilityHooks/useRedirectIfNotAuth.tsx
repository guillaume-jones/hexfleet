import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import { auth } from 'src/firebase/firebaseApp';

export default function useRedirectIfNotAuth(redirectIfAnonymous?: boolean) {
  const router = useRouter();
  const [user, userLoading] = useIdToken(auth);

  useEffect(() => {
    if (userLoading) return;

    if (!user || (user.isAnonymous && redirectIfAnonymous)) {
      void router.push('/');
      return;
    }
  }, [redirectIfAnonymous, user, userLoading, router]);
}
