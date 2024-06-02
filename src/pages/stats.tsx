import Head from 'next/head';

import AnonymousGameWarning from 'src/login/AnonymousGameWarning';
import MyStats from 'src/stats/MyStats';
import Rivalries from 'src/stats/Rivalries';
import useRedirectIfNotAuth from 'src/utilityHooks/useRedirectIfNotAuth';

export default function Leaderboard() {
  useRedirectIfNotAuth();

  return (
    <>
      <Head>
        <title>HexFleet - Stats</title>
      </Head>
      <div className="flex flex-1 flex-col items-center gap-4 p-8 pt-4">
        <AnonymousGameWarning />

        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <MyStats />
          <Rivalries />
        </div>
      </div>
    </>
  );
}
