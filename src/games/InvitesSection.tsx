import { Transition } from '@headlessui/react';
import { doc } from 'firebase/firestore';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import GameInviteContent from './GameInviteContent';
import { Invites } from 'functions/src/document-types/Invites';

import { auth, firestore } from 'src/firebase/firebaseApp';

export const InvitesSection = () => {
  const [user] = useIdToken(auth);
  const [invites] = useDocumentData<Partial<Invites>>(
    user && doc(firestore, 'invites', user.uid),
  );

  const gameInvites = invites?.gameInvites;

  return (
    <div className="flex w-64 flex-col items-center gap-4">
      <h2
        className={`text-2xl font-semibold ${
          gameInvites ? 'opacity-100' : 'opacity-0'
        } transition-opacity`}>
        Invites
      </h2>
      {gameInvites
        ?.filter((invite) => invite.expiresAt.toMillis() > Date.now())
        .map((invite) => (
          <Transition
            key={invite.createdAt.toMillis()}
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
        ))}
      <div
        className={`transition-opacity delay-1000 ${
          gameInvites ? 'opacity-100' : 'opacity-0'
        }`}>
        {invites?.gameInvites?.length === 0 && <p>No invites yet.</p>}
      </div>
    </div>
  );
};
