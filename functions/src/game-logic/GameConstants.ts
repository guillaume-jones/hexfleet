import { Player } from '../document-types/Games';

// Game logic
export const minPressureInterval = 2;
export const pressureToConquer = minPressureInterval * 2;
export const pressureToDisable = minPressureInterval * 1;
export const pressureToClear = 0;
export const maxPressure = 8;
export const maxInfluenceReach = 2;
export const homeworldDistanceModifier = 3;
export const tileMaintenance = 1;
export const startingInfluence = 2;

// Game setup
export const shortIdLength = 5;
export const minimumPlayers = 2;
export const maximumPlayers = 6;
export const defaultPlayer: Omit<Player, 'id'> = {
  dead: false,
  sent: false,
};
