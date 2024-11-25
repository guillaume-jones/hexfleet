import Head from 'next/head';
import { useRouter } from 'next/router';

import GameDisplay from 'src/game/GameDisplay';
import { CampaignProvider } from 'src/game/game-context/CampaignContext';

export default function Game() {
  const { query } = useRouter();
  const gameId = query.gameId;

  return (
    <>
      <Head>
        <title>HexFleet - Singleplayer</title>
      </Head>
      {typeof gameId === 'string' && (
        <CampaignProvider gameId={gameId}>
          <GameDisplay />
        </CampaignProvider>
      )}
    </>
  );
}
