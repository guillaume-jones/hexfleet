import { signInAnonymously } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import { auth } from 'src/firebase/firebaseApp';

const useAccount = () => {
  const [user, userLoading] = useIdToken(auth);

  // Loading state which takes into account anonymous login
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;

    const asyncFunction = async () => {
      if (!user) {
        await signInAnonymously(auth);
      }
      setIsLoading(false);
    };

    asyncFunction().catch(console.error);
  }, [user, userLoading]);

  return {
    user: isLoading ? null : user,
    isLoading,
    isLoggedIn: !!user,
    isFullUser: !!user && !user.isAnonymous,
  };
};

export default useAccount;
