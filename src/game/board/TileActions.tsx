import { GameContext } from '../game-context/GameContext';
import { useContext, useMemo } from 'react';

import {
  canApplyPressure,
  canClear,
} from 'functions/src/game-logic/tileActionTests';

import Button from 'src/components/interactive/Button';
import Input from 'src/components/interactive/Input';

export type TileActionsProps = {
  clientX: number;
  clientY: number;
  x?: number;
  y?: number;
  show?: boolean;
};

const TileActions = ({ clientX, clientY, x, y, show }: TileActionsProps) => {
  const { projectedBoard, updateNextTurn } = useContext(GameContext);

  const tile = useMemo(
    () => projectedBoard?.find((t) => t.x === x && t.y === y),
    [projectedBoard, x, y],
  );

  return (
    <div
      style={{
        transform: `scale(1) translate(${clientX}px, ${clientY}px) translate(-50%)`,
        opacity: show ? 1 : 0,
      }}
      className="absolute -top-6 left-0 z-10 flex items-center gap-3 rounded-xl bg-zinc-900 p-4 transition-all duration-200">
      <p>Influence</p>
      {tile && (
        <Input
          value={String(tile?.pressure ?? 0)}
          setValue={(value) => {
            const pressure = Number(value);
            if (canApplyPressure({ distance: tile.distance, pressure })) {
              updateNextTurn({ ...tile, pressure });
            }
          }}
          className="w-16"
          placeholder={'0'}
          inputProps={{ type: 'number', min: 0 }}
        />
      )}
      {tile &&
        canClear({
          homeworld: tile.homeworld,
          playerId: tile.playerId ?? tile.previousPlayerId,
          clear: tile.clear,
        }) && (
          <Button
            disabled={!tile}
            onClick={() => {
              updateNextTurn({ ...tile, clear: !tile.clear });
            }}>
            {tile.clear ? 'Undo Clear' : 'Clear'}
          </Button>
        )}
    </div>
  );
};

export default TileActions;
