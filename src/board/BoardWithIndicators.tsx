import countBy from 'lodash/countBy';
import React, { useMemo } from 'react';

import HexagonalBoard from './HexagonalBoard';
import ScoreBox from './ScoreBox';
import { getSpecialBorders } from './utils/getBorders';
import { Tile } from 'functions/src/document-types/Games';

const BoardWithIndicators = ({
  rawBoard,
  boardSize,
  players,
  turn,
}: {
  rawBoard: Tile[];
  boardSize: number;
  players: string[];
  turn: number;
}) => {
  const { board, ...scores } = useMemo(() => {
    const board = getSpecialBorders(rawBoard, boardSize)
      // Must sort or empty tiles override player tiles/borders
      .sort((a, b) => (a.playerId ? 1 : 0) - (b.playerId ? 1 : 0));

    const tilesByPlayer = countBy(board, 'playerId');
    delete tilesByPlayer.undefined;

    const influenceByPlayer = countBy(
      board.flatMap(({ borders, playerId }) => borders.map(() => playerId)),
    );

    return { board, tilesByPlayer, influenceByPlayer };
  }, [rawBoard, boardSize]);

  return (
    <div className="flex max-w-5xl flex-1 flex-col items-center gap-6 lg:items-end">
      <div className="lg:absolute lg:left-4 lg:top-4">
        <ScoreBox players={players} turn={turn} {...scores} />
      </div>
      <HexagonalBoard board={board} boardSize={boardSize} />
    </div>
  );
};

export default BoardWithIndicators;
