import Head from 'next/head';

import GameCreation from 'src/landing/GameCreation';
import GameJoining from 'src/landing/GameJoining';

export default function Landing() {
  return (
    <>
      <Head>
        <title>HexFleet - Hexagonal tile conquest</title>
      </Head>
      <div className="flex flex-1 flex-row">
        <GameCreation />
        <GameJoining />
      </div>
    </>
  );
}
