import Head from 'next/head';

import { InvitesSection } from 'src/games/InvitesSection';
import PastGamesSection from 'src/games/PastGamesSection';
import GameCreation from 'src/landing/GameCreation';
import GameJoining from 'src/landing/GameJoining';
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

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4">
            <h2 className={'text-2xl font-semibold'}>New Game</h2>
            <div
              className={
                'flex flex-col items-center justify-center gap-10 sm:flex-row sm:items-start sm:gap-0'
              }>
              <GameCreation />
              <GameJoining />
            </div>
          </div>
          <InvitesSection />
        </div>

        <PastGamesSection />
      </div>
    </>
  );
}
