import { Timestamp } from 'firebase/firestore';

export type Player = {
  id: string;
  hasResigned?: boolean;
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

export type TilePressure = TileCoords & {
  pressure?: number;
  clear?: boolean;
};

export type NextTurn = {
  pressures: TilePressure[];
};

export type Game = {
  boardSize: number;
  boardState: BoardState;
  createdAt: Timestamp;
  hasStarted: boolean;
  pastTurns: BoardState[];
  players: Player[];
  shortId: string;
  winner?: string;
};

export type JoinGameData = {
  gameId?: string;
  shortId?: string;
};
