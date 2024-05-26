import CloseButton from '../interactive/CloseButton';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useCallback } from 'react';

export default function Modal({
  open,
  showX = true,
  setOpen,
  children,
  title,
  className,
}: {
  showX?: boolean;
  open: boolean;
  setOpen: (arg0: boolean) => void;
  children?: React.ReactNode;
  className?: string;
  title?: string;
}) {
  const closeModal = useCallback(() => setOpen(false), [setOpen]);

  return (
    <>
      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-50"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-50"
        leaveTo="opacity-0"
        show={open}
        className="fixed inset-0 z-10"
        appear>
        <div className="h-full w-full bg-black" />
      </Transition>
      <Transition
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        show={open}
        as={Fragment}
        appear>
        <Dialog
          onClose={closeModal}
          className=" fixed inset-0 flex h-full w-full select-none items-center justify-center p-4">
          <Dialog.Panel
            className={`relative max-h-[80vh] overflow-visible rounded-2xl bg-zinc-900 p-6 shadow-lg ${
              className ?? ''
            }`}>
            {showX && (
              <div className="absolute right-2 top-2">
                <CloseButton onClick={closeModal} />
              </div>
            )}
            {title && (
              <Dialog.Title
                as="h1"
                className="pb-4 text-center text-xl font-bold">
                {title}
              </Dialog.Title>
            )}
            {children}
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </>
  );
}
