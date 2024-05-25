export type JoinGameData = {
  shortId: string;
};

export type StartGameData = {
  gameId: string;
};

export type EditGamePlayerData = {
  gameId: string;
  action: 'leave' | 'resign';
};

export type GameInviteData = {
  shortId: string;
  fromPlayerId: string;
  toPlayerIds: string[];
};
