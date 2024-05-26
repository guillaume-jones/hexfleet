import { Transition } from '@headlessui/react';

import GameInviteContent from './GameInviteContent';
import { GameInvite } from 'functions/src/document-types/Invites';

const GameInviteBox = ({ invite }: { invite: GameInvite }) => {
  return (
    <Transition
      enter=" ease-out "
      enterFrom="opacity-0"
      enterTo="opacity-100"
      show={true}
      appear
      className={
        'flex w-60 flex-col overflow-hidden rounded-2xl bg-zinc-900 p-4 transition duration-300'
      }>
      <GameInviteContent invite={invite} />
    </Transition>
  );
};

export default GameInviteBox;
