import React from 'react';

import { getColorForPlayer } from './boardColors';
import { TileState } from 'functions/src/document-types/Games';

const HexagonalBoard = ({
  board,
  boardSize,
}: {
  board: TileState[];
  boardSize: number;
}) => {
  // See https://en.wikipedia.org/wiki/Hexagon#Parameters
  const d = 10;
  const r = d / 2;
  const R = d / Math.sqrt(3);
  const halfBoardSize = Math.round(boardSize / 2);
  const viewBoxWidth = d * boardSize;
  const viewBoxHeight = R * 1.5 * boardSize + R / 2;
  const strokeWidth = 0.5;

  return (
    <svg
      viewBox={`${-strokeWidth / 2} ${-strokeWidth / 2} ${
        viewBoxWidth + strokeWidth
      } ${viewBoxHeight + strokeWidth}`}>
      {board.map(({ x, y, playerId }) => {
        const fill = getColorForPlayer(playerId);
        return (
          <g
            key={`${x},${y}`}
            transform={`translate(${halfBoardSize * r + x * d - r * y},${
              y * R * 1.5 + R
            })`}>
            <polygon
              z={playerId ? 5 : undefined}
              fill={fill}
              strokeWidth={strokeWidth}
              points={`0,${-R} ${r},${-R / 2} ${r},${R / 2} 0,${R} ${-r},${
                R / 2
              } ${-r},${-R / 2}`}
            />
            {/* Uncomment if needed for debugging */}
            <text textAnchor="middle" alignmentBaseline="middle" fontSize={3}>
              {x},{y}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default HexagonalBoard;
