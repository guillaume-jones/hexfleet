export type GameOutcomes = {
  wins1v1: number;
  losses1v1: number;
  winsFFA: number;
  lossesFFA: number;
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
};
