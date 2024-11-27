import randomColor from 'randomcolor';
import tinycolor from 'tinycolor2';

import { aiId } from 'src/campaign/campaign-maps';

const defaultColor = '#52525b';
const defaultClickableFill = '#26262b';
const defaultFill = '#151518';

const aiColor = '#e30952';

const colorCache: Record<string, string> = { [aiId]: aiColor };
const fillColorCache: Record<string, string> = {};

export const getColorForPlayer = (playerId?: string) => {
  if (!playerId) return defaultColor;
  if (colorCache[playerId]) return colorCache[playerId];

  const color = randomColor({ seed: playerId, luminosity: 'bright' });
  const tColor = tinycolor(color);
  tColor.saturate(100);
  tColor.lighten(10);
  colorCache[playerId] = tColor.toHexString();
  return colorCache[playerId];
};

export const getFillColor = (color: string, isClickable?: boolean) => {
  if (color === defaultColor)
    return isClickable ? defaultClickableFill : defaultFill;

  if (fillColorCache[color]) return fillColorCache[color];

  const tColor = tinycolor(color);
  tColor.darken(20);
  tColor.desaturate(20);
  fillColorCache[color] = tColor.toHexString();
  return fillColorCache[color];
};
