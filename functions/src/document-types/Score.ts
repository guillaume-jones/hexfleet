export type Score = {
  wins: number;
  losses: number;
  elo?: number;
};
export const initialScore: Score = {
  wins: 0,
  losses: 0,
};
