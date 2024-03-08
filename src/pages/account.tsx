import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import OtherBox from 'src/account/OtherBox';
import SecurityBox from 'src/account/SecurityBox';
import StyledLink from 'src/components/interactive/StyledLink';
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
      <div className="mx-6 mt-8 flex-1 pb-10">
        <div className="fixed hidden w-0 flex-col gap-2 sm:flex md:w-48">
          <h1 className={'mb-2 text-3xl font-semibold text-violet-900'}>
            Account
          </h1>
          <StyledLink href="#purchases" className="text-lg">
            Purchases
          </StyledLink>
          <StyledLink href="#security" className="text-lg">
            Security
          </StyledLink>
          <StyledLink href="#other" className="text-lg">
            Other
          </StyledLink>
        </div>

        <div className="sm:ml-48">
          <h2
            id={'security'}
            className={'mb-2 mt-6 text-xl font-semibold text-violet-900'}>
            Security
          </h2>
          <SecurityBox user={user} />
          <h2
            id={'other'}
            className={'mb-2 mt-6 text-xl font-semibold text-violet-900'}>
            Other
          </h2>
          <OtherBox />
          <p className="mt-4">
            For any account issues, please contact{' '}
            <StyledLink href="mailto:support@instantheader.com">
              support@instantheader.com
            </StyledLink>
            .
          </p>
        </div>
      </div>
    </>
  );
}
