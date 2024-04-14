import { Tile, TileWithBorders } from 'functions/src/document-types/Games';

type HexBoardTileProps = TileWithBorders<Tile> & {
  fill: string;
  stroke: string;
  baseStrokeWidth: number;
  R: number;
  r: number;
  textDisplayed?: boolean;
  animateBorders?: boolean;
};

const allBorders = [
  { angle: -150 },
  { angle: -90 },
  { angle: -30 },
  { angle: 30 },
  { angle: 90 },
  { angle: 150 },
];

const HexBoardTile = ({
  fill,
  stroke,
  baseStrokeWidth,
  R,
  r,
  textDisplayed,
  homeworld,
  borders,
  animateBorders,
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
      {(animateBorders ? allBorders : borders).map(({ angle }) => {
        const active = animateBorders
          ? borders.find((b) => b.angle === angle)
          : true;

        return (
          <line
            key={angle}
            className="transition-all duration-300"
            strokeLinecap={'round'}
            x1={-R / 2 + 1.1}
            y1={-r + 0.9}
            x2={R / 2 - 1.1}
            y2={-r + 0.9}
            stroke={stroke}
            strokeWidth={active ? baseStrokeWidth * 2.5 : 0}
            transform={`rotate(${angle})`}
          />
        );
      })}
      {homeworld && (
        <polygon
          className="transition-all duration-300"
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
