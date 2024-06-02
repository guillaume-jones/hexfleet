import Head from 'next/head';

import { InvitesSection } from 'src/games/InvitesSection';
import PastGamesSection from 'src/games/PastGamesSection';
import AnonymousGameWarning from 'src/login/AnonymousGameWarning';
import useRedirectIfNotAuth from 'src/utilityHooks/useRedirectIfNotAuth';

export default function Games() {
  useRedirectIfNotAuth();

  return (
    <>
      <Head>
        <title>HexFleet - Games</title>
      </Head>
      <div className="flex flex-1 flex-col items-center gap-4 p-8 pt-4">
        <AnonymousGameWarning />

        <InvitesSection />

        <PastGamesSection />
      </div>
    </>
  );
}
