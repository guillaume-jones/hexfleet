import { floor, round } from 'lodash';

export const roundToNearest = (value: number, nearest: number) => {
  return round(value / nearest) * nearest;
};

export const floorToNearest = (value: number, nearest: number) => {
  return floor(value / nearest) * nearest;
};
