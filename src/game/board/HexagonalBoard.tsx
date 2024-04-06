import { GameContext } from '../game-context/GameContext';
import React, { useContext, useState } from 'react';

import TileActions, { TileActionsProps } from './TileActions';
import { getBoardParameters } from './getBoardParameters';
import { maxInfluenceReach } from 'functions/src/game-logic/GameConstants';
import {
  canApplyPressure,
  canClear,
} from 'functions/src/game-logic/tileActionTests';

import {
  getColorForPlayer,
  getFillColor,
} from 'src/game/board-view-utils/boardColors';

type HexagonalBoardProps = {
  className?: string;
};

const HexagonalBoard = ({ className }: HexagonalBoardProps) => {
  const { boardState, boardSize, userId, updateNextTurn } =
    useContext(GameContext);
  const [tileActionsState, setTileActionsState] = useState<TileActionsProps>({
    clientX: 0,
    clientY: 0,
  });

  if (!boardState || !boardSize) return null;
  const { d, r, R, halfBoardSize, viewBoxW, viewBoxH, baseStrokeWidth } =
    getBoardParameters(boardSize);
  const userColor = getColorForPlayer(userId);

  return (
    <div
      className={`flex h-full w-full ${className}`}
      onPointerLeave={() =>
        setTileActionsState((prev) => ({ ...prev, show: false }))
      }>
      <TileActions {...tileActionsState} />
      <svg
        className="max-w-4xl"
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
            const stroke = getColorForPlayer(
              clear ? previousPlayerId : playerId,
            );
            const fill = getFillColor(stroke);
            const playerChanged = playerId !== previousPlayerId;
            const isClickable = distance <= maxInfluenceReach;

            return (
              <g
                onMouseEnter={
                  isClickable
                    ? (e) =>
                        setTileActionsState((prev) => {
                          if (prev.show) return prev;
                          // Reduces animation by moving actions closer before click
                          return {
                            ...prev,
                            clientX: e.clientX,
                            clientY: e.clientY,
                          };
                        })
                    : undefined
                }
                onClick={
                  isClickable
                    ? (e) =>
                        setTileActionsState((prev) => {
                          // Toggles actions if clicking on same cell
                          if (prev.x === x && prev.y === y)
                            return { ...prev, show: !prev.show };

                          // Changes cells if clicking on new cell
                          return {
                            x,
                            y,
                            clientX: e.clientX,
                            clientY: e.clientY,
                            show: true,
                          };
                        })
                    : undefined
                }
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
                onAuxClick={() => {
                  if (
                    canClear({ homeworld, playerId: previousPlayerId }, userId)
                  ) {
                    updateNextTurn?.({
                      x,
                      y,
                      pressure,
                      distance,
                      clear: !clear,
                    });
                  }
                }}
                className={`group select-none ${
                  isClickable
                    ? 'cursor-pointer sm:hover:opacity-80'
                    : 'cursor-default'
                }`}
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
                    points={`0,${-R} ${r},${-R / 2} ${r},${
                      R / 2
                    } 0,${R} ${-r},${R / 2} ${-r},${-R / 2}`}
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
    </div>
  );
};

export default HexagonalBoard;
