import { doc, getDoc } from 'firebase/firestore';

import { Player } from 'functions/src/document-types/Games';
import { Profile } from 'functions/src/document-types/Profile';

import { firestore } from 'src/firebase/firebaseApp';

export type PlayerWithName = Player & {
  name: string;
};

const playerNameCache: Record<string, string> = {};

export const getNameForId = async (id: string) => {
  let name: string | undefined = playerNameCache[id];

  if (!name) {
    name =
      id.slice(0, 2) === 'AI'
        ? id
        : (
            await getDoc<Partial<Profile>, Partial<Profile>>(
              doc(firestore, 'profiles', id),
            )
          ).data()?.name;
    playerNameCache[id] = name || 'Anonymous';
  }

  return playerNameCache[id];
};

const addNameToPlayer = async (player: Player) => ({
  ...player,
  name: await getNameForId(player.id),
});

export const addNamesToPlayers = async (
  players: Player[],
): Promise<PlayerWithName[]> => {
  return await Promise.all(players.map((player) => addNameToPlayer(player)));
};
