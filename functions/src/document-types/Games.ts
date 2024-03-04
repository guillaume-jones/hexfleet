export type Player = {
  hasResigned?: boolean;
};

export type Tile = {
  x: number;
  y: number;
};

export type TileState = Tile & {
  player?: string;
};

export type BoardState = TileState[];

export type TileStructure = Tile & {
  inPlay: boolean;
};

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
  boardStructure: TileStructure[];
  pastTurns: BoardState[];
  boardState: BoardState;
  nextTurn: FirebaseFirestore.CollectionGroup<NextTurn>;
};
