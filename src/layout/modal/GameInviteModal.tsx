import { doc } from 'firebase/firestore';
import last from 'lodash/last';
import { useEffect, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { Invites } from 'functions/src/document-types/Invites';

import Modal from 'src/components/containers/Modal';
import { auth, firestore } from 'src/firebase/firebaseApp';
import GameInviteContent from 'src/games/GameInviteContent';

const invitesCountKey = 'invites-count';

const GameInviteModal = () => {
  const [user] = useIdToken(auth);
  const [invites] = useDocumentData<Partial<Invites>>(
    user && doc(firestore, 'invites', user.uid),
  );

  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    const gameInvitesCount = invites?.gameInvites?.length;
    if (gameInvitesCount === undefined) return;

    const prevGameInvitesCountString = localStorage.getItem(invitesCountKey);

    // Update count always
    localStorage.setItem(invitesCountKey, gameInvitesCount.toString());

    // Not yet saved on this machine
    if (prevGameInvitesCountString === null) return;

    if (gameInvitesCount > parseInt(prevGameInvitesCountString)) {
      setToastShown(true);
    }
  }, [invites]);

  const latestInvite = last(invites?.gameInvites);

  return (
    <Modal
      open={toastShown && !!latestInvite}
      setOpen={setToastShown}
      title="New Game Invite"
      className="h-auto gap-0">
      {latestInvite && <GameInviteContent invite={latestInvite} />}
    </Modal>
  );
};

export default GameInviteModal;
