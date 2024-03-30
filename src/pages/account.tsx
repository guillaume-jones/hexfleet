import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import PrivacyBox from 'src/account/PrivacyBox';
import ProfileBox from 'src/account/ProfileBox';
import SecurityBox from 'src/account/SecurityBox';
import StyledLink from 'src/components/interactive/StyledLink';
import { SettingsProvider } from 'src/context/SettingsContext';
import { auth } from 'src/firebase/firebaseApp';

export default function Account() {
  const { push } = useRouter();

  const [user, userLoading] = useAuthState(auth);
  // If not logged in, redirect to homepage
  useEffect(() => {
    if (!user && !userLoading) {
      push('/').catch((e) => console.error(e));
    }
  }, [push, user, userLoading]);

  return (
    <>
      <Head>
        <title>HexFleet - Account</title>
      </Head>
      <SettingsProvider>
        <div className="mx-6 mt-8 flex-1 pb-10">
          <h1 className={'mb-2 text-3xl font-semibold text-zinc-50'}>
            Account
          </h1>
          <h2
            id={'other'}
            className={'mb-4 mt-6 text-xl font-semibold text-zinc-50'}>
            Profile
          </h2>
          <ProfileBox />
          <h2
            id={'security'}
            className={'mb-4 mt-6 text-xl font-semibold text-zinc-50'}>
            Security
          </h2>
          <SecurityBox user={user} />
          <h2
            id={'other'}
            className={'mb-4 mt-6 text-xl font-semibold text-zinc-50'}>
            Privacy
          </h2>
          <PrivacyBox />
          <p className="mt-6">
            For any account issues, please contact{' '}
            <StyledLink href="mailto:support@instantheader.com">
              support@instantheader.com
            </StyledLink>
            .
          </p>
        </div>
      </SettingsProvider>
    </>
  );
}
