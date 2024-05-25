import Head from 'next/head';

import PastGamesSection from 'src/games/PastGamesSection';
import GameCreation from 'src/landing/GameCreation';
import GameJoining from 'src/landing/GameJoining';
import AnonymousGameWarning from 'src/login/AnonymousGameWarning';

export default function PastGames() {
  return (
    <>
      <Head>
        <title>HexFleet - Games</title>
      </Head>
      <div className="flex flex-1 flex-col items-center gap-6 p-8 pt-4">
        <AnonymousGameWarning />

        <div
          className={
            'flex flex-col justify-center gap-10 sm:flex-row sm:gap-0'
          }>
          <GameCreation />
          <GameJoining />
        </div>

        <h2 className="text-2xl font-semibold">Invites</h2>

        <PastGamesSection />
      </div>
    </>
  );
}
