import Head from 'next/head';

import ProfileBox from 'src/account/ProfileBox';
import SecurityBox from 'src/account/SecurityBox';
import { SettingsProvider } from 'src/context/SettingsContext';
import useRedirectIfNotAuth from 'src/utilityHooks/useRedirectIfNotAuth';

export default function Account() {
  useRedirectIfNotAuth(true);

  return (
    <>
      <Head>
        <title>HexFleet - Account</title>
        <meta name="robots" content="noindex" />
      </Head>
      <SettingsProvider>
        <div className="mx-6 mt-8 flex max-w-lg flex-1 flex-col gap-4 pb-10">
          <h1 className={'text-3xl font-semibold text-zinc-50'}>Account</h1>
          <SecurityBox />
          <ProfileBox />
        </div>
      </SettingsProvider>
    </>
  );
}
