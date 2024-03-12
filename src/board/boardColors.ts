import randomColor from 'randomcolor';
import tinycolor from 'tinycolor2';

const defaultColor = '#333';
const defaultBorderColor = '#666';

export const getColorForPlayer = (playerId?: string) => {
  if (!playerId) return defaultColor;
  return randomColor({ seed: playerId, luminosity: 'dark' });
};

export const getBorderColor = (color?: string) => {
  if (color === defaultColor) return defaultBorderColor;

  const tColor = tinycolor(color);
  tColor.lighten(15);
  return tColor.toHexString();
};
