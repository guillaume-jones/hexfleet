import { Tile } from 'functions/src/document-types/Games';

export type CampaignMap = {
  id: string;
  title: string;
  boardSize: number;
  boardState: Tile[];
};

export const aiId = 'AI';
export const playerId = 'playerId';

export const campaignMaps: CampaignMap[] = [
  {
    id: 'xds7Z',
    title: 'First Steps',
    boardSize: 5,
    boardState: [
      { x: 0, y: 0 },
      { x: 1, y: 0, playerId: 'AI', homeworld: true },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2, playerId: 'playerId' },
      { x: 2, y: 2 },
      { x: 3, y: 2, playerId: 'playerId' },
      { x: 4, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 2, y: 4 },
      { x: 3, y: 4, playerId: 'playerId', homeworld: true },
      { x: 4, y: 4 },
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
