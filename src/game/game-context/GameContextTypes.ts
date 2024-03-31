import { Player } from 'functions/src/document-types/Games';
import { Tile } from 'functions/src/document-types/Games';

export type Border = {
  angle: number;
};

export type TileWithBorders<T extends Tile> = T & {
  borders: Border[];
};

export type PlayerWithName = Player & {
  name: string;
};
