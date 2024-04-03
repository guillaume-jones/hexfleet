// See https://en.wikipedia.org/wiki/Hexagon#Parameters
export const getBoardParameters = (boardSize: number) => {
  const d = 10;
  const r = d / 2;
  const R = d / Math.sqrt(3);
  const halfBoardSize = Math.round(boardSize / 2);
  const viewBoxW = d * boardSize;
  const viewBoxH = R * 1.5 * boardSize + R / 2;
  const baseStrokeWidth = 0.2;
  return { d, r, R, halfBoardSize, viewBoxW, viewBoxH, baseStrokeWidth };
};
