import { PlayerWithName } from '../game-context/GameContextTypes';
import { doc, getDoc } from 'firebase/firestore';

import { Player } from 'functions/src/document-types/Games';
import { Profile } from 'functions/src/document-types/Profile';

import { firestore } from 'src/firebase/firebaseApp';

const playerNameCache: Record<string, string> = {};

const addNameToPlayer = async (player: Player) => {
  let name: string | undefined = playerNameCache[player.id];

  if (!name) {
    name = (
      await getDoc<Partial<Profile>, Partial<Profile>>(
        doc(firestore, 'profiles', player.id),
      )
    ).data()?.name;
  }

  return {
    ...player,
    name: name || 'Anonymous',
  };
};

export const addNamesToPlayers = async (
  players: Player[],
): Promise<PlayerWithName[]> => {
  return await Promise.all(players.map((player) => addNameToPlayer(player)));
};
