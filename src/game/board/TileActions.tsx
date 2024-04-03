import { GameContext } from '../game-context/GameContext';
import { useContext, useMemo } from 'react';

import Button from 'src/components/interactive/Button';
import Input from 'src/components/interactive/Input';

export type TileActionsProps = {
  clientX: number;
  clientY: number;
  x?: number;
  y?: number;
};

const TileActions = ({ clientX, clientY, x, y }: TileActionsProps) => {
  const { boardState, updateNextTurn, userId } = useContext(GameContext);

  const tile = useMemo(
    () => boardState?.find((t) => t.x === x && t.y === y),
    [boardState, x, y],
  );

  return (
    <div
      style={{
        transform: `scale(1) translate(${clientX}px, ${clientY}px) translate(-50%)`,
        opacity: x !== undefined ? 1 : 0,
      }}
      className="absolute -top-6 left-0 z-10 flex items-center gap-3 rounded-xl bg-zinc-900 p-4 transition-all duration-200">
      <p>Influence</p>
      <Input
        value={String(tile?.pressure)}
        setValue={(value) => {
          const pressure = Number(value);
          if (!tile || pressure < 0) return;
          updateNextTurn?.({ ...tile, pressure });
        }}
        className="w-16"
        placeholder={'0'}
        inputProps={{ type: 'number', min: 0 }}
      />
      {tile?.previousPlayerId === userId && !tile.homeworld && (
        <Button
          onClick={() => {
            updateNextTurn?.({ ...tile, clear: !tile.clear });
          }}>
          {tile.clear ? 'Undo Clear' : 'Clear'}
        </Button>
      )}
    </div>
  );
};

export default TileActions;
