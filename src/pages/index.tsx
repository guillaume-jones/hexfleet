import Head from 'next/head';

import GameCreation from 'src/landing/GameCreation';

export default function Landing() {
  return (
    <>
      <Head>
        <title>HexFleet - Hexagonal tile conquest</title>
      </Head>
      <div className="flex-1">
        <div className="max-w-72">
          <GameCreation />
        </div>
      </div>
    </>
  );
}
