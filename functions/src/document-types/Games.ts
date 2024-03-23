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
  players: Player[];
  createdTime: Date;
  hasStarted?: boolean;
  winner?: string;
  pastTurns: BoardState[];
  boardState: BoardState;
  boardSize: number;
  nextTurn: FirebaseFirestore.CollectionGroup<NextTurn>;
};
