import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';

import { auth } from 'src/firebase/firebaseApp';
import EmailLogin from 'src/login/EmailLogin';
import LoginTypeBox from 'src/login/LoginTypeBox';
import ProviderButton from 'src/login/ProviderButton';

export default function Login() {
  const [user] = useAuthState(auth);
  const { push, query } = useRouter();

  // If logged in, redirect
  useEffect(() => {
    if (user) {
      const redirectTo =
        typeof query.redirect === 'string' ? query.redirect : '/generator';
      push(redirectTo).catch((e) => console.error(e));
    }
  }, [push, query.redirect, user]);

  const [signInWithGoogle, , googleLoading] = useSignInWithGoogle(auth);

  return (
    <>
      <Head>
        <title>Instant Header - Sign up or log in</title>
      </Head>
      <div className="flex-1">
        <div className="flex flex-col items-center gap-10 px-5 pt-10 sm:flex-row sm:items-start sm:justify-center">
          <LoginTypeBox title="Use a provider">
            <ProviderButton
              loginFunction={signInWithGoogle}
              provider="Google"
              loading={googleLoading}
            />
          </LoginTypeBox>
          <LoginTypeBox title="Use your email">
            <EmailLogin />
          </LoginTypeBox>
        </div>
      </div>
    </>
  );
}
