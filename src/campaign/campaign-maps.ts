import { Tile } from 'functions/src/document-types/Games';

import { aiId } from 'src/game/create-game/createGame';

export type CampaignMap = {
  id: string;
  title: string;
  boardSize: number;
  boardState: Tile[];
};

export const campaignMaps: CampaignMap[] = [
  {
    id: 'xds7Z',
    title: 'First Steps',
    boardSize: 9,
    boardState: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0, playerId: aiId, homeworld: true },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
      { x: 6, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 7, y: 3 },
      { x: 0, y: 4 },
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 8, y: 4 },
      { x: 1, y: 5 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
      { x: 4, y: 5 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
      { x: 8, y: 5 },
      { x: 2, y: 6 },
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
      { x: 6, y: 6 },
      { x: 7, y: 6 },
      { x: 8, y: 6 },
      { x: 3, y: 7 },
      { x: 4, y: 7 },
      { x: 5, y: 7 },
      { x: 6, y: 7 },
      { x: 7, y: 7 },
      { x: 8, y: 7 },
      { x: 4, y: 8 },
      { x: 5, y: 8 },
      { x: 6, y: 8, playerId: 'playerId', homeworld: true },
      { x: 7, y: 8 },
      { x: 8, y: 8 },
    ],
  },
];

export const getCampaignMapForUser = (mapId: string, userId?: string) => {
  const campaignMap = campaignMaps.find((m) => m.id === mapId);
  if (!campaignMap || !userId) return;

  return {
    ...campaignMap,
    boardState: campaignMap.boardState.map((tile) => {
      if (tile.playerId === 'playerId') {
        return { ...tile, playerId: userId };
      }
      return tile;
    }),
  };
};
