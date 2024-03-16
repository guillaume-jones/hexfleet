import randomColor from 'randomcolor';
import tinycolor from 'tinycolor2';

const defaultColor = '#333';
const defaultBorderColor = '#666';

const colorCache: Record<string, string> = {};
const borderColorCache: Record<string, string> = {};

export const getColorForPlayer = (playerId?: string) => {
  if (!playerId) return defaultColor;
  if (colorCache[playerId]) return colorCache[playerId];

  const color = randomColor({ seed: playerId, luminosity: 'dark' });
  colorCache[playerId] = color;
  return color;
};

export const getBorderColor = (color: string) => {
  if (color === defaultColor) return defaultBorderColor;
  if (borderColorCache[color]) return borderColorCache[color];

  const tColor = tinycolor(color);
  tColor.lighten(20);
  tColor.saturate(20);
  borderColorCache[color] = tColor.toHexString();
  return borderColorCache[color];
};
