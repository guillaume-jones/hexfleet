import { GameContext } from '../game-context/GameContext';
import React, { useContext, useState } from 'react';

import HexBoardTile from './HexBoardTile';
import TileActions from './TileActions';
import { getBoardParameters } from './getBoardParameters';
import {
  minPressureInterval,
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
import useIsTouchscreen from 'src/utilityHooks/useIsTouchscreen';

const HexagonalBoard = () => {
  const { projectedBoard, boardSize, userId, updateNextTurn, setSelectedTile } =
    useContext(GameContext);
  const isTouchScreen = useIsTouchscreen();

  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timer>();

  if (!projectedBoard || !boardSize) {
    return null;
  }

  const { d, r, R, halfBoardSize, viewBoxW, viewBoxH, baseStrokeWidth } =
    getBoardParameters(boardSize);
  const userColor = getColorForPlayer(userId);

  return (
    <>
      <svg
        className="h-full w-full select-none"
        viewBox={`${-baseStrokeWidth / 2} ${-baseStrokeWidth / 2} ${
          viewBoxW + baseStrokeWidth
        } ${viewBoxH + baseStrokeWidth}`}>
        {projectedBoard.map((tile) => {
          const {
            x,
            y,
            playerId,
            homeworld,
            disabled,
            pressure,
            distance,
            clear,
            previousPlayerId,
            selected,
          } = tile;

          const playerChanged = playerId !== previousPlayerId;
          const isClickable = distance < Infinity;
          const distanceShown = distance > 1 && isClickable;
          const baseNewTilePressure = { x, y, distance, clear, pressure };
          const stroke = getColorForPlayer(clear ? previousPlayerId : playerId);
          const fill = getFillColor(stroke, isClickable);

          const changePressure = (delta: number) => {
            const newPressure = pressure + delta;
            const newTilePressure = {
              ...baseNewTilePressure,
              pressure: newPressure,
              clear:
                previousPlayerId !== userId && newPressure < pressureToConquer
                  ? false
                  : clear,
            };

            if (canApplyPressure(newTilePressure)) {
              updateNextTurn?.(newTilePressure);
            }
          };

          return (
            <g
              className={`group transition-all ${
                isClickable
                  ? 'cursor-pointer sm:hover:opacity-90'
                  : 'cursor-not-allowed'
              }`}
              fillOpacity={clear || disabled || playerChanged ? 0.8 : 1}
              strokeOpacity={playerChanged ? 0.5 : 1}
              key={`${x},${y}`}
              transform={`translate(${halfBoardSize * r + x * d - r * y},${
                y * R * 1.5 + R
              }) scale(0.99)`}
              // Touchscreen handling
              onTouchStart={() => {
                if (!isClickable || !isTouchScreen) return;
                setLongPressTimer(
                  setTimeout(() => {
                    setLongPressTimer(undefined);
                    if (!clear && !pressure) return;
                    updateNextTurn?.({
                      ...baseNewTilePressure,
                      pressure: 0,
                      clear: false,
                    });
                  }, 400),
                );
              }}
              onTouchEnd={() => {
                if (!isClickable || !isTouchScreen) return;

                // Long press already fired, skip action
                if (longPressTimer === undefined) return;
                clearTimeout(longPressTimer);
                setLongPressTimer(undefined);

                // One tap
                if (!selected) {
                  setSelectedTile({ x, y });
                }
                // Double tap
                else {
                  changePressure(pressureToConquer);
                }
              }}
              // Desktop handling
              onMouseUp={(e) => {
                if (!isClickable || isTouchScreen) return;

                const button = e.button;
                // Left click
                if (button === 0) {
                  changePressure(pressureToConquer);
                }
                // Right click
                else if (button === 2) {
                  changePressure(-pressureToConquer);
                }
                // Middle click
                else if (button === 1) {
                  if (canClear({ homeworld, playerId, clear }, userId)) {
                    updateNextTurn?.({
                      ...baseNewTilePressure,
                      clear: !clear,
                    });
                  }
                }
              }}
              onWheel={(e) => {
                if (!isClickable || isTouchScreen) return;
                changePressure(-Math.sign(e.deltaY) * minPressureInterval);
              }}
              onContextMenu={(e) => e.preventDefault()}>
              <HexBoardTile
                {...tile}
                fill={fill}
                stroke={stroke}
                baseStrokeWidth={baseStrokeWidth}
                R={R}
                r={r}
                animateBorders
                polygonProps={
                  selected
                    ? {
                        transform: 'scale(.96)',
                        strokeWidth: baseStrokeWidth * 3,
                        stroke: '#DDD',
                        strokeOpacity: 1,
                      }
                    : {}
                }
                homeworldProps={{
                  className: `transition-opacity duration-200 ${
                    pressure > 0 || (distanceShown && selected)
                      ? 'opacity-30'
                      : ''
                  }  ${distanceShown ? 'group-hover:opacity-30' : ''}`,
                }}
              />
              {isClickable && (
                <>
                  <g
                    className={`transition-all duration-300 ${
                      clear ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      transform: `translate(${distanceShown ? -R / 3.5 : 0}px,${
                        distanceShown ? R / 2.8 : pressure > 0 ? R / 2.4 : 0
                      }px)`,
                    }}>
                    <circle
                      r={R / 5}
                      fill={'#00000000'}
                      stroke={userColor}
                      strokeWidth={baseStrokeWidth * 2}
                      strokeOpacity={1}
                    />
                    <line
                      x1={-R / 5}
                      y1={-R / 5}
                      x2={R / 5}
                      y2={R / 5}
                      strokeLinecap={'round'}
                      stroke={userColor}
                      strokeWidth={baseStrokeWidth * 2}
                      strokeOpacity={1}
                    />
                  </g>
                  <text
                    className={`transition-all duration-200 sm:font-normal ${
                      pressure > 0 ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      transform: `translate(0px, -${
                        distanceShown || clear ? R / 5 : 0
                      }px)`,
                    }}
                    textAnchor={'middle'}
                    alignmentBaseline={'middle'}
                    fontSize={4.4}
                    fillOpacity={1}
                    fill={userColor}>
                    {pressure || ''}
                  </text>
                  {distanceShown && (
                    <text
                      className={`transition-all duration-200 sm:group-hover:opacity-100 ${
                        pressure > 0 || selected ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        transform: `translate(${clear ? R / 3 : 0}px, ${
                          R / 2.4
                        }px)`,
                      }}
                      textAnchor={'middle'}
                      alignmentBaseline={'middle'}
                      fontSize={2.5}
                      fillOpacity={1}
                      fill={userColor}>
                      {distance}x
                    </text>
                  )}
                </>
              )}
              {/* For debugging
              <text textAnchor="middle" alignmentBaseline="middle" fontSize={3}>
                {x},{y}
              </text> 
              */}
            </g>
          );
        })}
      </svg>
      {isTouchScreen && <TileActions />}
    </>
  );
};

export default HexagonalBoard;
