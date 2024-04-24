import clamp from 'lodash/clamp';
import { Dispatch, SetStateAction } from 'react';

export default function Range({
  value,
  setValue,
  className,
  id,
  min = 0,
  max = 100,
  step = 1,
  startText,
  endText,
}: {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  min?: number;
  max?: number;
  step?: number;
  startText?: string;
  endText?: string;
  className?: string;
  id?: string;
}) {
  return (
    <div className="flex touch-none flex-row items-center">
      {startText && <p className="mr-2">{startText}</p>}
      <input
        onWheel={(e) => {
          setValue((prev) =>
            clamp(prev + step * (e.deltaY > 0 ? -1 : 1), min, max),
          );
        }}
        type="range"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        min={min}
        max={max}
        step={step}
        id={id}
        style={{}}
        className={`w-28 rounded-lg hover:cursor-grab active:cursor-grabbing
          ${className ?? ''}`}
      />
      {endText && <p className="ml-2">{endText}</p>}
    </div>
  );
}
