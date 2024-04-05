import { Player, TileWithPressure } from 'functions/src/document-types/Games';
import { Tile } from 'functions/src/document-types/Games';

export type ProjectedTile<T extends Tile> = TileWithPressure<T> & {
  previousPlayerId?: string;
};

export type PlayerWithName = Player & {
  name: string;
};
