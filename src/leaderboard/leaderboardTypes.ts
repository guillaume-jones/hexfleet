import { Score } from 'functions/src/document-types/Score';

export type ExtendedScore = Partial<Score> & {
  name: string;
  id: string;
};

export type PossibleOrderField =
  | 'elo1v1'
  | 'eloFFA'
  | 'wins1v1'
  | 'winsFFA'
  | 'wr1v1'
  | 'wrFFA';

export type LeaderboardType = '1v1' | 'FFA';
