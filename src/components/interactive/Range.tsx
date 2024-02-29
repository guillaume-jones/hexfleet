import { useCallback } from 'react';

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
  setValue: (e: number) => void;
  min?: number;
  max?: number;
  step?: number;
  startText?: string;
  endText?: string;
  className?: string;
  id?: string;
}) {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(parseInt(e.target.value)),
    [setValue],
  );

  return (
    <div className="flex flex-row items-center">
      {startText && <p className="mr-2">{startText}</p>}
      <input
        type="range"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        id={id}
        style={{}}
        className={`w-28 rounded-md accent-stone-50 hover:cursor-grab active:cursor-grabbing
          ${className ?? ''}`}
      />
      {endText && <p className="ml-2">{endText}</p>}
    </div>
  );
}
