import randomColor from 'randomcolor';
import tinycolor from 'tinycolor2';

const defaultColor = '#52525b';
const defaultFillColor = '#27272a';

const colorCache: Record<string, string> = {};
const fillColorCache: Record<string, string> = {};

export const getColorForPlayer = (playerId?: string) => {
  if (!playerId) return defaultColor;
  if (colorCache[playerId]) return colorCache[playerId];

  const color = randomColor({ seed: playerId, luminosity: 'bright' });
  const tColor = tinycolor(color);
  tColor.saturate(100);
  tColor.lighten(5);
  colorCache[playerId] = tColor.toHexString();
  return colorCache[playerId];
};

export const getFillColor = (color: string) => {
  if (color === defaultColor) return defaultFillColor;
  if (fillColorCache[color]) return fillColorCache[color];

  const tColor = tinycolor(color);
  tColor.darken(20);
  tColor.desaturate(20);
  fillColorCache[color] = tColor.toHexString();
  return fillColorCache[color];
};
