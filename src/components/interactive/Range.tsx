import clamp from 'lodash/clamp';
import { Dispatch, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Range({
  value,
  setValue,
  id,
  min = 0,
  max = 100,
  step = 1,
  startText,
  endText,
  showValue,
  className = '',
  containerClassname = '',
  onChange,
}: {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  min?: number;
  max?: number;
  step?: number;
  startText?: string;
  endText?: string;
  id?: string;
  showValue?: boolean;
  className?: string;
  containerClassname?: string;
  onChange?: (value: number) => void;
}) {
  return (
    <div
      className={`flex touch-none flex-row items-center gap-2 ${containerClassname}`}>
      {startText && <p>{startText}</p>}
      {showValue && <p className="font-bold">{value}</p>}
      <input
        onWheel={(e) => {
          const newValue = clamp(
            value + step * (e.deltaY > 0 ? -1 : 1),
            min,
            max,
          );
          setValue(newValue);
          onChange?.(newValue);
        }}
        type="range"
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value);
          setValue(newValue);
          onChange?.(newValue);
        }}
        min={min}
        max={max}
        step={step}
        id={id}
        style={{}}
        className={twMerge(
          'w-28 rounded-lg hover:cursor-grab active:cursor-grabbing',
          className,
        )}
      />
      {endText && <p>{endText}</p>}
    </div>
  );
}
