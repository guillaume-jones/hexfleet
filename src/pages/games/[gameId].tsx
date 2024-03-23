import Head from 'next/head';
import { useRouter } from 'next/router';

import { GameProvider } from 'src/board/GameContext';

export default function Game() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>HexFleet - Game</title>
      </Head>
      <GameProvider gameId={router.query.gameId as string}>
        <div />
        {/* <GameDisplay /> */}
      </GameProvider>
    </>
  );
}
