import React, { useContext } from 'react';

import { GameContext } from './GameContext';
import {
  getColorForPlayer,
  getFillColor,
} from './board-view-utils/boardColors';

const HexagonalBoard = () => {
  const { board, boardSize } = useContext(GameContext);

  if (!board || !boardSize) return null;

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
      className="max-w-3xl"
      viewBox={`${-baseStrokeWidth / 2} ${-baseStrokeWidth / 2} ${
        viewBoxWidth + baseStrokeWidth
      } ${viewBoxHeight + baseStrokeWidth}`}>
      {board.map(({ x, y, playerId, borders, homeworld, disabled }) => {
        const stroke = getColorForPlayer(playerId);
        const fill = getFillColor(stroke);
        return (
          <g
            fillOpacity={disabled ? 0.6 : 1}
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
            {borders.map(({ angle }) => {
              return (
                <line
                  key={angle}
                  strokeLinecap={'round'}
                  x1={-R / 2 + 1.1}
                  y1={-r + 0.9}
                  x2={R / 2 - 1.1}
                  y2={-r + 0.9}
                  stroke={stroke}
                  strokeWidth={baseStrokeWidth * (disabled ? 1.5 : 2.5)}
                  transform={`rotate(${angle})`}
                />
              );
            })}
            {homeworld && (
              <polygon
                fill={stroke}
                points={`0,${-R} ${r},${-R / 2} ${r},${R / 2} 0,${R} ${-r},${
                  R / 2
                } ${-r},${-R / 2}`}
                transform={'scale(0.4)'}
              />
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
