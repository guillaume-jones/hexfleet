import { useCallback } from 'react';

function Textarea({
  value,
  setValue,
  placeholder,
  className,
  thick,
  id,
  disabled,
  textareaProps,
  children,
}: {
  value: string;
  setValue: (e: string) => void;
  placeholder?: string;
  className?: string;
  thick?: boolean;
  id?: string;
  disabled?: boolean;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  children?: React.ReactNode;
}) {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value),
    [setValue],
  );

  return (
    <div
      className={`w-full bg-stone-50 p-1 pl-2 ring-violet-800 transition-all duration-200 
      ${
        thick
          ? 'rounded-xl ring-2 focus-within:ring-4 sm:hover:ring-violet-600'
          : 'rounded-md ring-1 ring-opacity-40 focus-within:ring-opacity-80 disabled:ring-opacity-40'
      }
      ${disabled ? 'bg-stone-100 ring-stone-700 sm:hover:ring-stone-700' : ''} 
      ${className ?? ''} `}>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        id={id}
        style={{}}
        className={
          'h-full w-full resize-none appearance-none border-none bg-stone-50 text-black outline-none transition-all duration-200 disabled:bg-stone-100'
        }
        {...textareaProps}
      />
      {children}
    </div>
  );
}

export default Textarea;
