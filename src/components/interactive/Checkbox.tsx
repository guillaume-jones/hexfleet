import { CheckIcon } from '@heroicons/react/20/solid';
import { Dispatch, SetStateAction, useCallback } from 'react';

function Checkbox({
  checked,
  setChecked,
  label,
  className,
  id,
  disabled,
}: {
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
  label?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}) {
  const toggle = useCallback(
    () => setChecked((checked) => !checked),
    [setChecked],
  );

  return (
    <div className="flex w-full items-center gap-2">
      <label
        id={id}
        className={`flex flex-row items-center rounded-md active:bg-transparent ${
          className ?? ''
        }`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={toggle}
          disabled={disabled}
          className={
            'h-6 w-6 cursor-pointer appearance-none rounded-md border-0 bg-zinc-50 transition-all duration-150 checked:bg-violet-900  focus:border-0 focus:ring-0 focus:ring-offset-0 disabled:cursor-default disabled:bg-zinc-300 sm:hover:bg-violet-300 sm:checked:hover:bg-violet-800 sm:disabled:bg-zinc-300'
          }
        />
        <CheckIcon
          className={`border-1 absolute h-6 w-6 cursor-pointer ${
            disabled ? 'invisible' : ''
          }`}
        />
      </label>
      <p>{label}</p>
    </div>
  );
}

export default Checkbox;
