import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

function Select<T extends string>({
  value,
  setValue,
  options,
  className,
  disabled,
}: {
  value: T;
  setValue: (value: T) => void;
  options: ReadonlyArray<T>;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Listbox value={value} onChange={setValue} disabled={disabled}>
      <div className={`relative z-20 ${className ?? ''}`}>
        <Listbox.Button
          className="w-full rounded-lg bg-stone-50 text-violet-800 transition-all  duration-300 hover:bg-violet-200 disabled:bg-stone-300 disabled:text-stone-600 "
          disabled={disabled}>
          {({ open }) => (
            <div
              className={`flex w-full flex-row items-center justify-between rounded-lg border-b py-1 pl-2 pr-1 font-semibold transition-all duration-300  ${
                open ? 'border-stone-300 bg-violet-100' : 'border-transparent'
              }`}>
              <p>{value}</p>
              <ChevronDownIcon
                className={`h-6 w-6 transition-all duration-200 ${
                  open ? 'rotate-180' : ''
                } `}
              />
            </div>
          )}
        </Listbox.Button>
        <Transition
          className={''}
          enter="transition duration-250 ease-out"
          enterFrom="transform scale-y-0 opacity-50"
          enterTo="transform scale-y-100 opacity-100"
          leave="transition duration-250 ease-in"
          leaveFrom="transform scale-y-100  opacity-100"
          leaveTo="transform scale-y-0  opacity-50">
          <Listbox.Options className="absolute mt-1 w-full overflow-hidden rounded-lg bg-stone-50 shadow-md">
            {options.map((option) => (
              <Listbox.Option key={option} value={option} className="group">
                <button
                  className={`w-full border-b border-stone-200 px-2 py-1 text-left  text-violet-800 transition-all duration-200 hover:bg-violet-200 group-last:rounded-b-lg ${
                    option === value ? 'bg-violet-100 font-semibold' : ''
                  }`}>
                  {option}
                </button>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export default Select;
