import Head from 'next/head';

import HexagonalBoard from 'src/board/HexagonalBoard';
import { testBoard } from 'src/board/testBoard';

export default function Landing() {
  return (
    <>
      <Head>
        <title>HexFleet - Hexagonal tile conquest</title>
      </Head>
      <div className="flex w-full flex-1 flex-col items-center">
        <HexagonalBoard board={testBoard} boardSize={13} />
      </div>
    </>
  );
}
