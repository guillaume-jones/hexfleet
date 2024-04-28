import Head from 'next/head';
import { useEffect } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import GoogleLogin from './GoogleLogin';

import { auth } from 'src/firebase/firebaseApp';
import EmailLogin from 'src/login/email/EmailLogin';

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [user] = useIdToken(auth);

  useEffect(() => {
    if (user && !user.isAnonymous) onSuccess();
  }, [user, onSuccess]);

  return (
    <>
      <Head>
        <title>HexFleet - Sign up or log in</title>
      </Head>
      <div className="flex-1">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div>
            <h2 className="mb-4 text-center text-xl">Use a provider</h2>
            <GoogleLogin />
          </div>
          <div className=" hidden w-0.5 flex-1 self-stretch rounded-sm bg-zinc-50 sm:flex" />
          <div>
            <h2 className="mb-4 text-center text-xl">Use your email</h2>
            <EmailLogin />
          </div>
        </div>
      </div>
    </>
  );
}
