export type Player = {
  hasResigned?: boolean;
};

export type Tile = {
  x: number;
  y: number;
};

export type TileState = Tile & {
  playerId?: string;
};

export type BoardState = TileState[];

export type TilePressure = Tile & {
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
