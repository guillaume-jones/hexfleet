import { doc } from 'firebase/firestore';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import GameInviteBox from './GameInviteBox';
import { Invites } from 'functions/src/document-types/Invites';

import { auth, firestore } from 'src/firebase/firebaseApp';

export const InvitesSection = () => {
  const [user] = useIdToken(auth);

  const [invites] = useDocumentData<Partial<Invites>>(
    user && doc(firestore, 'invites', user.uid),
  );

  return (
    <>
      <h2
        className={`text-2xl font-semibold ${
          invites ? 'opacity-100' : 'opacity-0'
        } transition-opacity`}>
        Invites
      </h2>
      {invites?.gameInvites?.map((invite) => (
        <GameInviteBox key={invite.shortId} invite={invite} />
      ))}
      <div
        className={`transition-opacity delay-1000 ${
          invites ? 'opacity-100' : 'opacity-0'
        }`}>
        {invites?.gameInvites?.length === 0 && <p>No invites yet.</p>}
      </div>
    </>
  );
};
