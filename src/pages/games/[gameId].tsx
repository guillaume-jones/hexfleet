import Head from 'next/head';
import { useRouter } from 'next/router';

import GameDisplay from 'src/game/GameDisplay';
import { GameProvider } from 'src/game/game-context/GameContext';

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
