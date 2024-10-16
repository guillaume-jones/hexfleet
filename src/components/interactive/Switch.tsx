import { Dispatch, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Switch({
  value,
  setValue,
  className,
  id,
  startText,
  endText,
}: {
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  startText?: string;
  endText?: string;
  className?: string;
  id?: string;
}) {
  return (
    <div className="flex touch-none flex-row items-center justify-center gap-2">
      {startText && (
        <p className={`transition-colors ${!value ? 'text-violet-400' : ''}`}>
          {startText}
        </p>
      )}
      <input
        type="range"
        value={+value}
        onChange={() => undefined}
        onClick={() => setValue((prev) => !prev)}
        onTouchEnd={() => setValue((prev) => !prev)}
        min={0}
        max={1}
        step={1}
        id={id}
        style={{}}
        className={twMerge(
          'w-8 rounded-lg hover:cursor-grab active:cursor-grabbing',
          className,
        )}
      />
      <style jsx>{`
        input[type='range']::-webkit-slider-runnable-track {
          background: ${value ? '#a78bfa' : ''};
        }
        input[type='range']::-moz-range-track {
          background: ${value ? '#a78bfa' : ''};
        }
      `}</style>
      {endText && (
        <p className={`transition-colors ${value ? 'text-violet-400' : ''}`}>
          {endText}
        </p>
      )}
    </div>
  );
}
