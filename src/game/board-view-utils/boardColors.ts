import randomColor from 'randomcolor';
import tinycolor from 'tinycolor2';

const defaultColor = '#52525b';

const colorCache: Record<string, string> = {};
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
  if (fillColorCache[color]) return fillColorCache[color];
  const isDefault = color === defaultColor;

  const tColor = tinycolor(color);
  tColor.darken(isDefault && !isClickable ? 26 : 20);
  tColor.desaturate(isDefault ? 0 : 20);
  fillColorCache[color] = tColor.toHexString();
  return fillColorCache[color];
};
