import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import PrivacyBox from 'src/account/PrivacyBox';
import ProfileBox from 'src/account/ProfileBox';
import SecurityBox from 'src/account/SecurityBox';
import { SettingsProvider } from 'src/context/SettingsContext';
import { auth } from 'src/firebase/firebaseApp';

export default function Account() {
  const { push } = useRouter();

  const [user, userLoading] = useIdToken(auth);
  // If not logged in or is anonymous, redirect to homepage
  useEffect(() => {
    if (!userLoading && (!user || user.isAnonymous)) void push('/');
  }, [push, user, userLoading]);

  return (
    <>
      <Head>
        <title>HexFleet - Account</title>
      </Head>
      <SettingsProvider>
        <div className="mx-6 mt-8 flex max-w-lg flex-1 flex-col gap-4 pb-10">
          <h1 className={'text-3xl font-semibold text-zinc-50'}>Account</h1>
          <SecurityBox />
          <ProfileBox />
          <PrivacyBox />
        </div>
      </SettingsProvider>
    </>
  );
}
