import { Transition } from '@headlessui/react';
import { useState } from 'react';

import Button from 'src/components/interactive/Button';
import CreateNewGame from 'src/game/create-game/CreateNewGame';

type GameCreationProps = {
  className?: string;
};

const GameCreation = ({ className }: GameCreationProps) => {
  const [show, setShown] = useState(false);

  return (
    <div className={`flex w-64 flex-col items-center gap-4 ${className}`}>
      <Button
        fontClassName="text-lg font-semibold"
        onClick={() => setShown(true)}>
        Create Game
      </Button>
      <Transition
        className="flex w-full flex-col gap-3 overflow-hidden rounded-lg bg-zinc-800 p-3 transition-all duration-500"
        enter="ease-out"
        enterFrom="opacity-0 max-h-0"
        enterTo="opacity-100 max-h-[420px]"
        leave="ease-in"
        leaveFrom="opacity-100 max-h-[420px]"
        leaveTo="opacity-0 max-h-0"
        show={show}>
        <CreateNewGame onCancel={() => setShown(false)} />
      </Transition>
    </div>
  );
};

export default GameCreation;
