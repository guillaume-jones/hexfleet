import { useCallback } from 'react';

export default function Input({
  value,
  setValue,
  placeholder,
  className,
  id,
  disabled,
  inputProps,
}: {
  value: string;
  setValue: (e: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    [setValue],
  );

  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      id={id}
      className={`resize-none appearance-none rounded-md border-none bg-zinc-50 px-3 py-2 
        text-zinc-950 outline-none ring-1 ring-zinc-300 transition-all duration-300 focus:ring-violet-800
          ${className ?? ''} `}
      {...inputProps}
    />
  );
}
