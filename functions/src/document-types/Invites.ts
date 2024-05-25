import { Timestamp } from 'firebase/firestore';

export type GameInvite = {
  expiresAt: Timestamp;
  fromPlayerId: string;
  shortId: string;
};

export type Invites = {
  gameInvites: GameInvite[];
};
