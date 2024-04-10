import {
  PlayerWithName,
  addNamesToPlayers,
} from '../board-view-utils/addNamesToPlayers';
import { useEffect, useState } from 'react';

import { Game } from 'functions/src/document-types/Games';

const usePlayers = (game?: Partial<Game>) => {
  const [players, setPlayers] = useState<PlayerWithName[]>([]);

  // Loads in player names
  useEffect(() => {
    const asyncFunction = async () => {
      if (game?.players) setPlayers(await addNamesToPlayers(game.players));
    };
    asyncFunction().catch(console.error);
  }, [game?.players]);

  return players;
};

export default usePlayers;
