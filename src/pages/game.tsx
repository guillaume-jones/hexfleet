import Head from 'next/head';
import { useRouter } from 'next/router';

import GameDisplay from 'src/game/GameDisplay';
import { GameProvider } from 'src/game/game-context/GameContext';

export default function Game() {
  const { query } = useRouter();
  const gameId = query.id;

  return (
    <>
      <Head>
        <title>HexFleet - Game</title>
      </Head>
      {typeof gameId === 'string' && (
        <GameProvider gameId={gameId}>
          <GameDisplay />
        </GameProvider>
      )}
    </>
  );
}
