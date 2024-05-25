import { Transition } from '@headlessui/react';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useHttpsCallable } from 'react-firebase-hooks/functions';

import { GameInvite } from 'functions/src/document-types/Invites';
import { JoinGameData } from 'functions/src/game-functions/functionInputs';

import Button from 'src/components/interactive/Button';
import { auth, firestore, functions } from 'src/firebase/firebaseApp';
import { getNameForId } from 'src/game/board-view-utils/addNamesToPlayers';
import { getColorForPlayer } from 'src/game/board-view-utils/boardColors';

const GameInviteBox = ({ invite }: { invite: GameInvite }) => {
  const [user] = useIdToken(auth);

  const router = useRouter();
  const [joinGame] = useHttpsCallable<JoinGameData>(functions, 'httpsCallable');

  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [errorShown, setErrorShown] = useState(false);

  // Fetches name of player who sent the invite
  const [name, setName] = useState<string>();
  useEffect(() => {
    getNameForId(invite.fromPlayerId).then(setName).catch(console.error);
  }, [invite.fromPlayerId]);

  const inviteRef = user && doc(firestore, 'invites', user.uid);

  return (
    <Transition
      enter=" ease-out "
      enterFrom="opacity-0"
      enterTo="opacity-100"
      show={!!name}
      appear
      className={
        'flex w-full max-w-96 flex-col gap-4 rounded-2xl bg-zinc-900 p-4 transition duration-300'
      }>
      <div className="flex justify-between gap-4">
        <div className="flex flex-col">
          <p>Invite from</p>
          <p
            className="font-semibold"
            style={{ color: getColorForPlayer(invite.fromPlayerId) }}>
            {name}
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-right">Expires at:</p>
          <p className="text-right">
            {invite.expiresAt.toDate().toLocaleTimeString(undefined, {
              hour: 'numeric',
              minute: 'numeric',
            })}
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          light
          loading={isRejectLoading}
          onClick={() => {
            if (!inviteRef) return;

            setIsRejectLoading(true);
            const asyncFunction = async () => {
              await updateDoc(inviteRef, {
                gameInvites: arrayRemove(invite),
              });
            };
            asyncFunction()
              .catch(console.error)
              .finally(() => {
                setIsRejectLoading(false);
              });
          }}>
          Decline
        </Button>
        <Button
          loading={isAcceptLoading}
          onClick={() => {
            if (!inviteRef) return;

            setIsAcceptLoading(true);

            const asyncFunction = async () => {
              const result = await joinGame({ shortId: invite.shortId });
              if (result && typeof result.data === 'string') {
                await updateDoc(inviteRef, {
                  gameInvites: arrayRemove(invite),
                });

                void router.push(`/game/${result.data}`);
              } else {
                throw new Error('Did not receive a game id.');
              }
            };
            asyncFunction()
              .catch((e) => {
                setErrorShown(true);
                console.error(e);
              })
              .finally(() => {
                setIsAcceptLoading(false);
              });
          }}>
          Accept
        </Button>
      </div>
      {errorShown && (
        <p className="text-center text-red-500">
          Failed to join - game may have already started.
        </p>
      )}
    </Transition>
  );
};

export default GameInviteBox;
