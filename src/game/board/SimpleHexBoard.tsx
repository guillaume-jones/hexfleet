import {
  getColorForPlayer,
  getFillColor,
} from '../board-view-utils/boardColors';
import React from 'react';

import HexBoardTile from './HexBoardTile';
import { getBoardParameters } from './getBoardParameters';
import { Tile, TileWithBorders } from 'functions/src/document-types/Games';

type HexagonalBoardProps = {
  board?: TileWithBorders<Tile>[];
  boardSize?: number;
};

const SimpleHexBoard = ({ board, boardSize }: HexagonalBoardProps) => {
  if (!board || !boardSize) return null;

  const { d, r, R, halfBoardSize, viewBoxW, viewBoxH, baseStrokeWidth } =
    getBoardParameters(boardSize);

  return (
    <svg
      className="h-full w-full select-none"
      viewBox={`${-baseStrokeWidth / 2} ${-baseStrokeWidth / 2} ${
        viewBoxW + baseStrokeWidth
      } ${viewBoxH + baseStrokeWidth}`}>
      {board.map((tile) => {
        const { x, y, playerId } = tile;
        const stroke = getColorForPlayer(playerId);
        const fill = getFillColor(stroke, true);
        return (
          <g
            className="select-none duration-100"
            fillOpacity={tile.disabled ? 0.8 : 1}
            key={`${x},${y}`}
            transform={`translate(${halfBoardSize * r + x * d - r * y},${
              y * R * 1.5 + R
            }) scale(0.99)`}>
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

export default SimpleHexBoard;
