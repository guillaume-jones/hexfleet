import Head from 'next/head';

import HexagonalBoard from 'src/board/HexagonalBoard';
import { generateBoard } from 'src/board/generateBoard';

export default function Landing() {
  const board = generateBoard(13, { testBoard: true });

  return (
    <>
      <Head>
        <title>HexFleet - Hexagonal tile conquest</title>
      </Head>
      <div className="flex w-full flex-1 flex-col items-center">
        <HexagonalBoard board={board} />
      </div>
    </>
  );
}
