import { useContext } from 'react';
import { Lock, Unlock } from 'react-feather';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useHttpsCallable } from 'react-firebase-hooks/functions';

import { GameContext } from './game-context/GameContext';
import { EditGamePlayerData } from 'functions/src/document-types/Games';

import Button from 'src/components/interactive/Button';
import { auth, functions } from 'src/firebase/firebaseApp';

type MinorGameActionsProps = {
  className?: string;
};

const MinorGameActions = ({ className }: MinorGameActionsProps) => {
  const [user] = useAuthState(auth);

  const {
    shortId,
    hasStarted,
    gameId,
    nextTurnLocked,
    players,
    toggleNextTurnLock,
  } = useContext(GameContext);

  const [editGamePlayer, loading] = useHttpsCallable<EditGamePlayerData>(
    functions,
    'editGamePlayer',
  );

  if (!shortId) return null;
  if (players.some((p) => p.id === user?.uid)) return null;

  return (
    <div
      className={`flex w-80 flex-col gap-2 rounded-xl bg-zinc-800 px-4 py-3 ${className}
      `}>
      <h2 className="text-2xl font-semibold">Your Actions</h2>
      <div className="flex flex-row justify-between gap-2">
        {hasStarted && (
          <Button onClick={() => toggleNextTurnLock()}>
            <div className="flex flex-row items-center gap-2">
              {nextTurnLocked ? 'Unlock next turn' : 'Lock next turn'}
              {nextTurnLocked ? <Unlock size={20} /> : <Lock size={20} />}
            </div>
          </Button>
        )}
        <Button
          light
          loading={loading}
          onClick={() => {
            const asyncFunction = async () =>
              editGamePlayer({
                gameId,
                action: hasStarted ? 'resign' : 'leave',
              });
            asyncFunction().catch(console.error);
          }}>
          {hasStarted ? 'Resign' : 'Leave Game'}
        </Button>
      </div>
    </div>
  );
};

export default MinorGameActions;
