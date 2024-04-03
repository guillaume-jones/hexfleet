import {
  getColorForPlayer,
  getFillColor,
} from '../board-view-utils/boardColors';
import { TileWithBorders } from '../game-context/GameContextTypes';
import React from 'react';

import { getBoardParameters } from './getBoardParameters';
import { Tile } from 'functions/src/document-types/Games';

type HexagonalBoardProps = {
  className?: string;
  board?: TileWithBorders<Tile>[];
  boardSize?: number;
};

const SimpleHexBoard = ({
  className,
  board,
  boardSize,
}: HexagonalBoardProps) => {
  if (!board || !boardSize) return null;

  const { d, r, R, halfBoardSize, viewBoxW, viewBoxH, baseStrokeWidth } =
    getBoardParameters(boardSize);

  return (
    <svg
      className={`max-w-4xl ${className}`}
      viewBox={`${-baseStrokeWidth / 2} ${-baseStrokeWidth / 2} ${
        viewBoxW + baseStrokeWidth
      } ${viewBoxH + baseStrokeWidth}`}>
      {board.map(({ x, y, playerId, borders, homeworld, disabled }) => {
        const stroke = getColorForPlayer(playerId);
        const fill = getFillColor(stroke);
        return (
          <g
            className="transition-opacity duration-100 sm:hover:opacity-85"
            fillOpacity={disabled ? 0.5 : 1}
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
          </g>
        );
      })}
    </svg>
  );
};

export default SimpleHexBoard;
