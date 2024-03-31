import { Player, TileWithPressure } from 'functions/src/document-types/Games';
import { Tile } from 'functions/src/document-types/Games';

export type Border = {
  angle: number;
};

export type TileWithBorders = TileWithPressure<Tile> & {
  borders: Border[];
  futurePlayerId?: string;
};

export type PlayerWithName = Player & {
  name: string;
};
