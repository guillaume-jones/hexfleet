export type Player = {
  hasResigned?: boolean;
};

export type TileCoords = {
  x: number;
  y: number;
};

export type Tile = TileCoords & {
  playerId?: string;
  homeworld?: boolean;
};

export type BoardState = Tile[];

export type TilePressure = TileCoords & {
  pressure?: number;
  clear?: boolean;
};

export type NextTurn = {
  pressures: TilePressure[];
};

export type Games = {
  players: FirebaseFirestore.CollectionGroup<Player>;
  createdTime: Date;
  hasStarted: boolean;
  winner: string;
  pastTurns: BoardState[];
  boardState: BoardState;
  boardSize: number;
  nextTurn: FirebaseFirestore.CollectionGroup<NextTurn>;
};
