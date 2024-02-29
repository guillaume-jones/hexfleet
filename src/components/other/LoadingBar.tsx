import { Transition } from '@headlessui/react';

export default function LoadingBar({
  durationString,
  show,
  className,
}: {
  durationString: string;
  show?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`border-green h-4 w-full rounded-lg bg-emerald-200 ${
        className ?? ''
      } duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <Transition
        appear
        show={show}
        enter={`transition-all ease-linear ${durationString}`}
        enterFrom="w-0 h-full"
        enterTo="w-full h-full">
        <div
          className={
            'h-full w-full rounded-lg bg-emerald-400 duration-[2000ms]'
          }
        />
      </Transition>
    </div>
  );
}
