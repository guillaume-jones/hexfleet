import { ExtendedScore, PossibleOrderField } from './leaderboardTypes';

export const calculateWr = (wins?: number, losses?: number) => {
  const sum =
    wins !== undefined && losses !== undefined ? wins + losses : undefined;
  return wins !== undefined && sum ? wins / sum : undefined;
};

export const sortScores = (
  scores: ExtendedScore[],
  orderField: PossibleOrderField,
) => {
  scores.sort((a, b) => {
    if (orderField === 'wr1v1') {
      return (
        (calculateWr(b.wins1v1, b.losses1v1) ?? 0) -
        (calculateWr(a.wins1v1, a.losses1v1) ?? 0)
      );
    } else if (orderField === 'wrFFA') {
      return (
        (calculateWr(b.winsFFA, b.lossesFFA) ?? 0) -
        (calculateWr(a.winsFFA, a.lossesFFA) ?? 0)
      );
    } else {
      return (b[orderField] ?? 0) - (a[orderField] ?? 0);
    }
  });
};
