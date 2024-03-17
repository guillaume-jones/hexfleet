import Head from 'next/head';

import BoardWithIndicators from 'src/board/BoardWithIndicators';
import { generateBoard } from 'src/board/utils/generateBoard';

const boardSize = 13;
const players = ['abc', 'def', 'ghi'];

export default function Landing() {
  const testBoard = generateBoard({ boardSize, players });

  return (
    <>
      <Head>
        <title>HexFleet - Hexagonal tile conquest</title>
      </Head>

      <BoardWithIndicators
        rawBoard={testBoard}
        boardSize={boardSize}
        players={players}
        turn={3}
      />
    </>
  );
}
