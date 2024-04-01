import React from 'react';

import {
  getColorForPlayer,
  getFillColor,
} from './board-view-utils/boardColors';
import { TileWithBorders } from './game-context/GameContextTypes';
import {
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';

type HexagonalBoardProps = {
  className?: string;
  board?: TileWithBorders[];
  boardSize?: number;
  userId?: string;
  onTileScroll?: (tile: TileWithPressure<TileCoords>) => void;
};

const transparency = '#00000000';

const HexagonalBoard = ({
  className,
  board,
  boardSize,
  userId,
  onTileScroll,
}: HexagonalBoardProps) => {
  if (!board || !boardSize) return null;

  // See https://en.wikipedia.org/wiki/Hexagon#Parameters
  const d = 10;
  const r = d / 2;
  const R = d / Math.sqrt(3);
  const halfBoardSize = Math.round(boardSize / 2);
  const viewBoxWidth = d * boardSize;
  const viewBoxHeight = R * 1.5 * boardSize + R / 2;
  const baseStrokeWidth = 0.2;
  const userColor = getColorForPlayer(userId);

  return (
    <svg
      className={`max-w-4xl ${className}`}
      viewBox={`${-baseStrokeWidth / 2} ${-baseStrokeWidth / 2} ${
        viewBoxWidth + baseStrokeWidth
      } ${viewBoxHeight + baseStrokeWidth}`}>
      {board.map(
        ({
          x,
          y,
          playerId,
          borders,
          homeworld,
          disabled,
          pressure,
          clear,
          futurePlayerId,
        }) => {
          const stroke = getColorForPlayer(futurePlayerId ?? playerId);
          const fill = getFillColor(stroke);
          return (
            <g
              onWheel={(e) => {
                onTileScroll?.({
                  x,
                  y,
                  pressure: Math.max(pressure + (e.deltaY > 0 ? -1 : 1), 0),
                });
              }}
              className="transition-opacity duration-100 sm:hover:opacity-85"
              fillOpacity={disabled || clear ? 0.5 : 1}
              strokeOpacity={futurePlayerId ? 0.4 : 1}
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
              {clear && (
                <>
                  <circle
                    r={R / 4}
                    fill={transparency}
                    stroke={stroke}
                    strokeWidth={baseStrokeWidth * 2}
                  />
                  <line
                    x1={-R / 4}
                    y1={-R / 4}
                    x2={R / 4}
                    y2={R / 4}
                    strokeLinecap={'round'}
                    stroke={stroke}
                    strokeWidth={baseStrokeWidth * 2}
                  />
                </>
              )}
              {!clear && pressure > 0 && (
                <text
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={4}
                  fillOpacity={1}
                  fill={userColor}>
                  {pressure}
                </text>
              )}
              {/* Uncomment if needed for debugging */}
              {/* <text textAnchor="middle" alignmentBaseline="middle" fontSize={3}>
              {x},{y}
            </text> */}
            </g>
          );
        },
      )}
    </svg>
  );
};

export default HexagonalBoard;
