import Head from 'next/head';

import HexagonalBoard from 'src/board/HexagonalBoard';
import { generateBoard } from 'src/board/generateBoard';
import { getContiguousZones } from 'src/board/getContiguousZones';

const boardSize = 13;
const board = generateBoard(boardSize, { testBoard: true });
export default function Landing() {
  getContiguousZones(board, boardSize);

  return (
    <>
      <Head>
        <title>HexFleet - Hexagonal tile conquest</title>
      </Head>
      <div className="flex w-full flex-1 flex-col items-center">
        <HexagonalBoard board={board} boardSize={boardSize} />
      </div>
    </>
  );
}
