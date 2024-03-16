import React from 'react';

import { getBorderColor, getColorForPlayer } from './utils/boardColors';
import { getSpecialBorders } from './utils/getBorders';
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
  const baseStrokeWidth = 0.2;

  return (
    <svg
      viewBox={`${-baseStrokeWidth / 2} ${-baseStrokeWidth / 2} ${
        viewBoxWidth + baseStrokeWidth
      } ${viewBoxHeight + baseStrokeWidth}`}>
      {getSpecialBorders(board, boardSize)
        // Must sort or empty tiles override player tiles/borders
        .sort((a, b) => (a.playerId ? 1 : 0) - (b.playerId ? 1 : 0))
        .map(({ x, y, playerId, borders }) => {
          const fill = getColorForPlayer(playerId);
          const stroke = getBorderColor(fill);
          return (
            <g
              key={`${x},${y}`}
              transform={`translate(${halfBoardSize * r + x * d - r * y},${
                y * R * 1.5 + R
              }) scale(0.99)`}>
              <polygon
                fill={fill}
                strokeWidth={baseStrokeWidth}
                stroke={stroke}
                points={`0,${-R} ${r},${-R / 2} ${r},${R / 2} 0,${R} ${-r},${
                  R / 2
                } ${-r},${-R / 2}`}
              />
              {borders.map(({ angle, controlled }) => {
                return (
                  <line
                    key={angle}
                    strokeLinecap={'round'}
                    x1={-R / 2 + 1.1}
                    y1={-r + 0.9}
                    x2={R / 2 - 1.1}
                    y2={-r + 0.9}
                    stroke={stroke}
                    strokeWidth={baseStrokeWidth * (controlled ? 2.5 : 1)}
                    transform={`rotate(${angle})`}
                  />
                );
              })}
              {playerId && (
                <text
                  fill={stroke}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={3}>
                  {borders.filter(({ controlled }) => controlled).length}
                </text>
              )}
              {/* Uncomment if needed for debugging */}
              {/* <text textAnchor="middle" alignmentBaseline="middle" fontSize={3}>
                {x},{y}
              </text> */}
            </g>
          );
        })}
    </svg>
  );
};

export default HexagonalBoard;
