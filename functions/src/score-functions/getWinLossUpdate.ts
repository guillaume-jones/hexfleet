import { firestore } from 'firebase-admin';

export const get1v1WinLossUpdate = ({
  playerId,
  playerIds,
  winner,
}: {
  playerId: string;
  playerIds: string[];
  winner: string;
}) => {
  const winsLosses = {
    wins1v1: firestore.FieldValue.increment(playerId === winner ? 1 : 0),
    losses1v1: firestore.FieldValue.increment(playerId === winner ? 0 : 1),
  };

  const opponent = playerIds.filter((p) => p !== playerId)[0];

  return {
    ...winsLosses,
    versus: { [opponent]: winsLosses },
  };
};

export const getFFAWinLossUpdate = ({
  playerId,
  playerIds,
  winner,
}: {
  playerId: string;
  playerIds: string[];
  winner: string;
}) => {
  const winsLosses = {
    winsFFA: firestore.FieldValue.increment(playerId === winner ? 1 : 0),
    lossesFFA: firestore.FieldValue.increment(playerId === winner ? 0 : 1),
  };

  const opponents = playerIds.filter((p) => p !== playerId);

  const versus = opponents.reduce((acc, opponent) => {
    return { ...acc, [opponent]: winsLosses };
  }, {});

  return {
    ...winsLosses,
    versus,
  };
};
