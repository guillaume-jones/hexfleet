import Head from 'next/head';
import { useRouter } from 'next/router';

import { GameProvider } from 'src/board/GameContext';
import GameDisplay from 'src/board/GameDisplay';

export default function Game() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>HexFleet - Game</title>
      </Head>
      <GameProvider gameId={router.query.gameId as string}>
        <div className="flex-1">
          <GameDisplay />
        </div>
      </GameProvider>
    </>
  );
}
