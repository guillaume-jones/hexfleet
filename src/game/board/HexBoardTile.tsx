import { Tile, TileWithBorders } from 'functions/src/document-types/Games';

type HexBoardTileProps = TileWithBorders<Tile> & {
  fill: string;
  stroke: string;
  baseStrokeWidth: number;
  R: number;
  r: number;
  textDisplayed?: boolean;
};

const HexBoardTile = ({
  fill,
  stroke,
  baseStrokeWidth,
  R,
  r,
  textDisplayed,
  homeworld,
  borders,
}: HexBoardTileProps) => {
  return (
    <>
      <polygon
        className="transition-colors duration-200"
        fill={fill}
        strokeWidth={baseStrokeWidth}
        stroke={stroke}
        points={`0,${-R} ${r},${-R / 2} ${r},${R / 2} 0,${R} ${-r},${
          R / 2
        } ${-r},${-R / 2}`}
      />
      {borders.map(({ angle }) => {
        return (
          <line
            key={angle}
            strokeLinecap={'round'}
            x1={-R / 2 + 1.1}
            y1={-r + 0.9}
            x2={R / 2 - 1.1}
            y2={-r + 0.9}
            stroke={stroke}
            strokeWidth={baseStrokeWidth * 2.5}
            transform={`rotate(${angle})`}
          />
        );
      })}
      {homeworld && (
        <polygon
          fillOpacity={textDisplayed ? 0.3 : 1}
          fill={stroke}
          points={`0,${-R} ${r},${-R / 2} ${r},${R / 2} 0,${R} ${-r},${
            R / 2
          } ${-r},${-R / 2}`}
          transform={'scale(0.4)'}
        />
      )}
    </>
  );
};

export default HexBoardTile;
