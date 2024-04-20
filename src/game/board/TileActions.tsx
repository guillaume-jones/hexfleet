import { GameContext } from '../game-context/GameContext';
import { useContext, useMemo } from 'react';
import { Minus, Plus, RotateCcw } from 'react-feather';

import {
  minPressureInterval,
  pressureToConquer,
} from 'functions/src/game-logic/GameConstants';
import {
  canApplyPressure,
  canClear,
} from 'functions/src/game-logic/tileActionTests';

import Button from 'src/components/interactive/Button';

const TileActions = () => {
  const { updateNextTurn, projectedBoard, userId } = useContext(GameContext);

  const tile = projectedBoard?.find((tile) => tile.selected);

  const changePressure = (delta: number) => {
    if (!tile) return;
    const newPressure = tile.pressure + delta;
    const newTilePressure = {
      x: tile.x,
      y: tile.y,
      distance: tile.distance,
      pressure: newPressure,
      clear:
        tile.previousPlayerId !== userId && newPressure < pressureToConquer
          ? false
          : tile.clear,
    };

    if (canApplyPressure(newTilePressure)) {
      updateNextTurn?.(newTilePressure);
    }
  };
  const canClearTile = useMemo(() => {
    if (!tile) return false;
    return canClear(tile, userId);
  }, [tile, userId]);

  return (
    <div
      className={`mt-4 flex select-none gap-3 rounded-xl bg-zinc-900 px-4
      py-3 transition-all duration-500 ${tile ? 'scale-100' : 'scale-0'}`}>
      <Button
        light
        className={`w-20 transition-all duration-300 ${
          canClearTile ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => {
          if (!tile) return;
          updateNextTurn?.({
            x: tile.x,
            y: tile.y,
            distance: tile.distance,
            pressure: tile.pressure,
            clear: !tile.clear,
          });
        }}>
        {tile?.clear ? 'Unclear' : 'Clear'}
      </Button>
      <div className=" flex items-center gap-2">
        <p
          className={`w-10 text-center text-2xl ${
            tile?.pressure ? 'font-semibold' : 'opacity-70'
          }`}>
          {tile?.pressure ?? ''}
        </p>
        {[
          {
            value: -(tile?.pressure ?? 0),
            label: <RotateCcw strokeWidth={3} size={20} />,
          },
          {
            value: -minPressureInterval,
            label: <Minus strokeWidth={4} size={20} />,
          },
          {
            value: minPressureInterval,
            label: <Plus strokeWidth={4} size={20} />,
          },
        ].map(({ value, label }) => (
          <Button
            key={label.key}
            className="flex h-12 w-12"
            fontClassName="text-5xl font-bold"
            onClick={() => changePressure(value)}>
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TileActions;
