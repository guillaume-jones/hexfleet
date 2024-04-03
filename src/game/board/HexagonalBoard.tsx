import {
  getColorForPlayer,
  getFillColor,
} from '../board-view-utils/boardColors';
import { GameContext } from '../game-context/GameContext';
import React, { useContext } from 'react';

import { getBoardParameters } from './getBoardParameters';

type HexagonalBoardProps = {
  className?: string;
};

const HexagonalBoard = ({ className }: HexagonalBoardProps) => {
  const { boardState, boardSize, userId, updateNextTurn } =
    useContext(GameContext);

  if (!boardState || !boardSize) return null;

  const { d, r, R, halfBoardSize, viewBoxW, viewBoxH, baseStrokeWidth } =
    getBoardParameters(boardSize);
  const userColor = getColorForPlayer(userId);

  return (
    <svg
      className={`max-w-4xl ${className}`}
      viewBox={`${-baseStrokeWidth / 2} ${-baseStrokeWidth / 2} ${
        viewBoxW + baseStrokeWidth
      } ${viewBoxH + baseStrokeWidth}`}>
      {boardState.map(
        ({
          x,
          y,
          playerId,
          borders,
          homeworld,
          disabled,
          pressure,
          clear,
          previousPlayerId,
        }) => {
          const stroke = getColorForPlayer(clear ? previousPlayerId : playerId);
          const fill = getFillColor(stroke);
          const playerChanged = playerId !== previousPlayerId;
          return (
            <g
              onWheel={(e) => {
                updateNextTurn?.({
                  x,
                  y,
                  clear,
                  pressure: Math.max(pressure + (e.deltaY > 0 ? -1 : 1), 0),
                });
              }}
              onAuxClick={() => {
                if (previousPlayerId !== userId || homeworld) return;
                updateNextTurn?.({ x, y, pressure, clear: !clear });
              }}
              className="transition-opacity duration-100 sm:hover:opacity-85"
              fillOpacity={disabled || clear ? 0.5 : playerChanged ? 0.9 : 1}
              strokeOpacity={playerChanged ? 0.4 : 1}
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
                  fillOpacity={pressure > 0 ? 0.3 : 1}
                  fill={stroke}
                  points={`0,${-R} ${r},${-R / 2} ${r},${R / 2} 0,${R} ${-r},${
                    R / 2
                  } ${-r},${-R / 2}`}
                  transform={'scale(0.4)'}
                />
              )}
              {clear && (
                <g
                  transform={
                    pressure === 0 ? '' : `translate(${-R / 4},${R / 4})`
                  }>
                  <circle
                    r={R / 4}
                    fill={'#00000000'}
                    stroke={stroke}
                    strokeWidth={baseStrokeWidth * 2}
                    strokeOpacity={1}
                  />
                  <line
                    x1={-R / 4}
                    y1={-R / 4}
                    x2={R / 4}
                    y2={R / 4}
                    strokeLinecap={'round'}
                    stroke={stroke}
                    strokeWidth={baseStrokeWidth * 2}
                    strokeOpacity={1}
                  />
                </g>
              )}
              {pressure > 0 && (
                <text
                  textAnchor={clear ? 'start' : 'middle'}
                  alignmentBaseline={clear ? 'baseline' : 'middle'}
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
