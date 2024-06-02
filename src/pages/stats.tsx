import Head from 'next/head';

import AnonymousGameWarning from 'src/login/AnonymousGameWarning';
import MyStats from 'src/stats/MyStats';
import useRedirectIfNotAuth from 'src/utilityHooks/useRedirectIfNotAuth';

export default function Leaderboard() {
  useRedirectIfNotAuth();

  return (
    <>
      <Head>
        <title>HexFleet - Stats</title>
      </Head>
      <div className="flex flex-1 flex-col items-center gap-4 p-8 pt-4 text-center">
        <AnonymousGameWarning />

        <MyStats />
        <h2 className="text-2xl font-semibold">Rivalries</h2>
      </div>
    </>
  );
}
