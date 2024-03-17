import Head from 'next/head';

import BoardWithIndicators from 'src/board/BoardWithIndicators';
import { testBoard } from 'src/board/testBoard';

export default function Landing() {
  return (
    <>
      <Head>
        <title>HexFleet - Hexagonal tile conquest</title>
      </Head>

      <BoardWithIndicators rawBoard={testBoard} boardSize={13} />
    </>
  );
}
