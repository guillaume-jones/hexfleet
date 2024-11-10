import { Tile } from 'functions/src/document-types/Games';

import { generateBoard } from 'src/game/board/generateBoard';

export type CampaignMap = {
  id: string;
  title: string;
  boardSize: number;
  boardState: Tile[];
};

export const campaignMaps: CampaignMap[] = Array<CampaignMap>(10).fill({
  id: 'xds7Z',
  title: 'First Steps',
  boardSize: 7,
  boardState: generateBoard({ boardSize: 7 }),
});
