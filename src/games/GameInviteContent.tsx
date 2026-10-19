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
import { isToday, isYesterday } from 'src/utils/dateComparisons';

const GameInviteContent = ({ invite }: { invite: GameInvite }) => {
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
  const inviteDate = invite.createdAt.toDate();
  return (
    <>
      <div className="flex gap-1">
        <p>From: </p>
        <p
          className="font-semibold"
          style={{ color: getColorForPlayer(invite.fromPlayerId) }}>
          {name}
        </p>
      </div>
      <p>
        {isToday(inviteDate)
          ? 'Today'
          : isYesterday(inviteDate)
          ? 'Yesterday'
          : inviteDate.toLocaleString(undefined, {
              weekday: 'long',
            })}
        ,{' '}
        {invite.expiresAt.toDate().toLocaleString(undefined, {
          hour: 'numeric',
          minute: 'numeric',
        })}
      </p>
      <div className="mt-2 flex justify-between">
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
                await router.push(`/game?id=${result.data}`);

                await updateDoc(inviteRef, {
                  gameInvites: arrayRemove(invite),
                });
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
      <p
        className={`text-center text-red-500 transition-all ${
          errorShown ? 'mt-2 h-12 opacity-100' : 'h-0 opacity-0'
        }`}>
        Failed to join. Game may have already started.
      </p>
    </>
  );
};

export default GameInviteContent;
