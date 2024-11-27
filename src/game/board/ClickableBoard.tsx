import {
  getColorForPlayer,
  getFillColor,
} from '../board-view-utils/boardColors';
import React, { Dispatch, SetStateAction, useMemo } from 'react';

import HexBoardTile from './HexBoardTile';
import { getBoardParameters } from './getBoardParameters';
import { BoardState } from 'functions/src/document-types/Games';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';

type ClickableBoardProps = {
  boardSize: number;
  boardState: BoardState;
  setBoardState: Dispatch<SetStateAction<BoardState>>;
  playerIds: string[];
  shouldConsoleOnClick?: boolean;
};

const ClickableBoard = ({
  boardState,
  setBoardState,
  boardSize,
  playerIds,
}: ClickableBoardProps) => {
  const { d, r, R, halfBoardSize, viewBoxW, viewBoxH, baseStrokeWidth } =
    useMemo(() => getBoardParameters(boardSize), [boardSize]);

  const boardWithBorders = useMemo(
    () => addBordersToBoard(boardState, boardSize),
    [boardState, boardSize],
  );

  return (
    <svg
      className="h-full w-full select-none"
      viewBox={`${-baseStrokeWidth / 2} ${-baseStrokeWidth / 2} ${
        viewBoxW + baseStrokeWidth
      } ${viewBoxH + baseStrokeWidth}`}>
      {boardWithBorders.map((tile) => {
        const { x, y, playerId } = tile;
        const stroke = getColorForPlayer(playerId);
        const fill = getFillColor(stroke, true);
        return (
          <g
            className="duration-100"
            fillOpacity={tile.disabled ? 0.8 : 1}
            key={`${x},${y}`}
            transform={`translate(${halfBoardSize * r + x * d - r * y},${
              y * R * 1.5 + R
            }) scale(0.99)`}
            onContextMenu={(e) => e.preventDefault()}
            onMouseUp={(e) => {
              const button = e.button;
              // Left/right click to assign or clear players
              if (button === 0 || button === 2) {
                setBoardState((prevBoard) =>
                  prevBoard.map((tile) => {
                    if (tile.x === x && tile.y === y) {
                      const newPlayerId = button ? playerIds[0] : playerIds[1];
                      return {
                        ...tile,
                        ...(newPlayerId === tile.playerId
                          ? { playerId: undefined }
                          : {
                              playerId: newPlayerId,
                            }),
                      };
                    }
                    return tile;
                  }),
                );
              }
              // Middle click to change homeworlds
              else if (button === 1) {
                setBoardState((prevBoard) =>
                  prevBoard.map((tile) => {
                    if (tile.x === x && tile.y === y) {
                      return {
                        ...tile,
                        homeworld: tile.homeworld ? undefined : true,
                      };
                    }
                    return tile;
                  }),
                );
              }
            }}>
            <HexBoardTile
              {...tile}
              fill={fill}
              stroke={stroke}
              baseStrokeWidth={baseStrokeWidth}
              R={R}
              r={r}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default ClickableBoard;
