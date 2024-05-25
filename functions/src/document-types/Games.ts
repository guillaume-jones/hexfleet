import { Timestamp } from 'firebase/firestore';

export type Player = {
  id: string;
  dead: boolean;
  sent: boolean;
};

export type TileCoords = {
  x: number;
  y: number;
};

export type Tile = TileCoords & {
  playerId?: string;
  homeworld?: boolean;
  disabled?: boolean;
};

export type BoardState = Tile[];

export type Border = {
  angle: number;
};

export type TileWithBorders<T extends Tile> = T & {
  borders: Border[];
};

export type TileWithPressure<T extends TileCoords> = T & {
  pressure: number;
  distance: number;
  clear: boolean;
};

export type NextTurn = {
  pressures: TileWithPressure<TileCoords>[];
};

export type Game = {
  boardSize: number;
  boardState: BoardState;
  createdAt: Timestamp;
  startedAt: Timestamp | null;
  endedAt: Timestamp | null;
  hasStarted: boolean;
  pastTurns: { boardState: BoardState }[];
  players: Player[];
  shortId: string;
  winner: string | null;
};
