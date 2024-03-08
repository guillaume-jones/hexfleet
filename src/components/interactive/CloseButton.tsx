import { XCircleIcon } from '@heroicons/react/20/solid';
import React from 'react';

const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button onClick={onClick}>
      <XCircleIcon className="h-8 w-8 text-zinc-50 transition-all hover:text-zinc-300 active:text-zinc-400" />
    </button>
  );
};

export default CloseButton;
