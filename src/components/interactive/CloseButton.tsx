import { XCircleIcon } from '@heroicons/react/20/solid';
import React from 'react';

const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className="outline-none" onClick={onClick}>
      <XCircleIcon className="h-10 w-10 text-zinc-50 transition-all hover:text-zinc-300 active:text-zinc-400" />
    </button>
  );
};

export default CloseButton;
