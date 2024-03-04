import { Dialog, Transition } from '@headlessui/react';
import { useCallback } from 'react';

export default function Modal({
  open,
  setOpen,
  children,
  className,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
  className?: string;
}) {
  const closeModal = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <Dialog open={open} onClose={closeModal}>
      <Transition
        enter="transition ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-30"
        show={open}
        className="fixed inset-0"
        appear>
        <div className="h-full w-full bg-violet-900" />
      </Transition>
      <Transition
        enter="transition ease-out duration-300"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        show={open}
        className="fixed inset-0"
        appear>
        <div className="flex h-full w-full items-center justify-center p-4">
          <Dialog.Panel
            className={`rounded-2xl bg-stone-50 p-6 shadow-lg ${
              className ?? ''
            }`}>
            {children}
          </Dialog.Panel>
        </div>
      </Transition>
    </Dialog>
  );
}
