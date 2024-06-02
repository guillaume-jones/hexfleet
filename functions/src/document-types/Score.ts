import { Timestamp } from 'firebase-admin/firestore';

export type GameType = '1v1' | 'FFA';

export type GameOutcome = {
  gameId: string;
  type: GameType;
  won: boolean;
  timestamp: Timestamp | null;
};

export type GameOutcomes = {
  wins1v1: number;
  losses1v1: number;
  winsFFA: number;
  lossesFFA: number;
  pastGames: GameOutcome[];
};

export type Score = GameOutcomes & {
  elo1v1?: number;
  eloFFA?: number;
  versus: {
    [key: string]: GameOutcomes;
  };
};

export const initialScore: Score = {
  wins1v1: 0,
  losses1v1: 0,
  winsFFA: 0,
  lossesFFA: 0,
  versus: {},
  pastGames: [],
};
