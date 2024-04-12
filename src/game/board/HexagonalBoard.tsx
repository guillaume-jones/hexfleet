import { GameContext } from '../game-context/GameContext';
import React, { useContext } from 'react';

import { getBoardParameters } from './getBoardParameters';
import {
  maxInfluenceReach,
  pressureToConquer,
} from 'functions/src/game-logic/GameConstants';
import {
  canApplyPressure,
  canClear,
} from 'functions/src/game-logic/tileActionTests';

import {
  getColorForPlayer,
  getFillColor,
} from 'src/game/board-view-utils/boardColors';

const HexagonalBoard = () => {
  const { boardState, boardSize, userId, updateNextTurn } =
    useContext(GameContext);

  if (!boardState || !boardSize) {
    return null;
  }
  const { d, r, R, halfBoardSize, viewBoxW, viewBoxH, baseStrokeWidth } =
    getBoardParameters(boardSize);
  const userColor = getColorForPlayer(userId);

  return (
    <svg
      className="h-full w-full select-none"
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
          distance,
          clear,
          previousPlayerId,
        }) => {
          const playerChanged = playerId !== previousPlayerId;
          const isClickable = distance <= maxInfluenceReach;
          const baseNewTilePressure = { x, y, distance, clear, pressure };
          const stroke = getColorForPlayer(clear ? previousPlayerId : playerId);
          const fill = getFillColor(stroke, isClickable);

          return (
            <g
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (
                  canClear({ homeworld, playerId: previousPlayerId }, userId)
                ) {
                  updateNextTurn?.({
                    ...baseNewTilePressure,
                    clear: !clear,
                  });
                  return;
                }
                const newTilePressure = {
                  ...baseNewTilePressure,
                  pressure: pressure - pressureToConquer,
                };

                if (canApplyPressure(newTilePressure)) {
                  updateNextTurn?.(newTilePressure);
                }
              }}
              onClick={() => {
                const newTilePressure = {
                  ...baseNewTilePressure,
                  pressure: pressure + pressureToConquer,
                };

                if (canApplyPressure(newTilePressure)) {
                  updateNextTurn?.(newTilePressure);
                }
              }}
              onWheel={(e) => {
                const newTilePressure = {
                  x,
                  y,
                  clear,
                  distance,
                  pressure: pressure + (e.deltaY > 0 ? -1 : 1),
                };

                if (canApplyPressure(newTilePressure)) {
                  updateNextTurn?.(newTilePressure);
                }
              }}
              className={`group select-none transition-all ${
                isClickable
                  ? 'cursor-pointer sm:hover:opacity-90'
                  : 'cursor-not-allowed'
              }`}
              fillOpacity={clear || disabled ? 0.8 : 1}
              strokeOpacity={playerChanged ? 0.4 : 1}
              key={`${x},${y}`}
              transform={`translate(${halfBoardSize * r + x * d - r * y},${
                y * R * 1.5 + R
              }) scale(0.99)`}>
              <polygon
                className="transition-colors"
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
                    className="transition-all"
                    key={angle}
                    strokeLinecap={'round'}
                    x1={-R / 2 + 1.1}
                    y1={-r + 0.9}
                    x2={R / 2 - 1.1}
                    y2={-r + 0.9}
                    stroke={stroke}
                    strokeWidth={baseStrokeWidth * 2.5}
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
                  alignmentBaseline={
                    clear || distance > 1 ? 'baseline' : 'middle'
                  }
                  fontSize={4}
                  fillOpacity={1}
                  fill={userColor}>
                  {pressure}
                </text>
              )}
              {distance > 1 && distance < Infinity && (
                <text
                  className={`opacity-0 sm:group-hover:opacity-100 ${
                    pressure > 0 ? 'opacity-100' : ''
                  }`}
                  textAnchor={'middle'}
                  alignmentBaseline={'text-before-edge'}
                  fontSize={2.5}
                  fillOpacity={1}
                  fill={userColor}>
                  {distance}x
                </text>
              )}
              {/* Uncomment if needed for debugging */}
              {/* <text
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={3}>
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
