import React from 'react';

import { getBorderColor, getColorForPlayer } from './boardUtils';
import { TileState } from 'functions/src/document-types/Games';

const HexagonalBoard = ({ board }: { board: TileState[] }) => {
  // See https://en.wikipedia.org/wiki/Hexagon#Parameters
  const d = 10;
  const r = d / 2;
  const R = d / Math.sqrt(3);
  const boardSize = Math.round(Math.sqrt(board.length));
  const halfBoardSize = Math.round(boardSize / 2);
  const viewBoxWidth = d * boardSize;
  const viewBoxHeight = R * 1.5 * boardSize + R / 2;
  const strokeWidth = 0.5;

  return (
    <svg
      viewBox={`${-strokeWidth / 2} ${-strokeWidth / 2} ${
        viewBoxWidth + strokeWidth
      } ${viewBoxHeight + strokeWidth}`}>
      {board.map(({ x, y, inPlay, playerId }) => {
        const fill = getColorForPlayer(playerId);
        return inPlay ? (
          <g
            key={`${x},${y}`}
            transform={`translate(${halfBoardSize * r + x * d - r * y},${
              y * R * 1.5 + R
            })`}>
            <polygon
              z={playerId ? 5 : undefined}
              fill={fill}
              stroke={getBorderColor(fill)}
              stroke-width={strokeWidth}
              points={`0,${-R} ${r},${-R / 2} ${r},${R / 2} 0,${R} ${-r},${
                R / 2
              } ${-r},${-R / 2}`}
            />
            {/* Uncomment if needed for debugging */}
            <text textAnchor="middle" alignmentBaseline="middle" fontSize={3}>
              {y},{x}
            </text>
          </g>
        ) : null;
      })}
    </svg>
  );
};

export default HexagonalBoard;
