import { useContext, useState } from 'react';
import { Lock, Unlock } from 'react-feather';
import { useHttpsCallable } from 'react-firebase-hooks/functions';

import { GameContext } from './game-context/GameContext';
import { EditGamePlayerData } from 'functions/src/document-types/Games';

import Modal from 'src/components/containers/Modal';
import Button from 'src/components/interactive/Button';
import { functions } from 'src/firebase/firebaseApp';

type GameActionsProps = {
  className?: string;
};

const GameActions = ({ className }: GameActionsProps) => {
  const [editGamePlayer, loading] = useHttpsCallable<EditGamePlayerData>(
    functions,
    'editGamePlayer',
  );

  const {
    shortId,
    hasStarted,
    gameId,
    nextTurnLocked,
    players,
    influenceByPlayer,
    influenceRemaining,
    projectedInfluenceByPlayer,
    toggleNextTurnLock,
    userId,
  } = useContext(GameContext);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  if (!shortId) return null;
  if (players.find((p) => p.id === userId)?.hasResigned) return null;

  return (
    <div
      className={`flex w-80 flex-col gap-4 rounded-xl bg-zinc-800 px-4 py-3 ${className}
      `}>
      <h2 className="text-2xl font-semibold">Your Actions</h2>
      {hasStarted && (
        <div>
          <div className="flex">
            <p>Influence left to spend:</p>
            <p
              className={`ml-2 font-bold ${
                influenceRemaining < 0 ? 'text-red-500' : ''
              }`}>
              {influenceRemaining}
            </p>
            <p className="font-bold">/{influenceByPlayer[userId]}</p>
          </div>
          <div className="flex italic">
            <p>Projected future influence:</p>
            <p className={'ml-2'}>{projectedInfluenceByPlayer[userId]}</p>
          </div>
        </div>
      )}
      <div className="flex flex-row justify-between gap-2">
        {hasStarted && (
          <Button
            disabled={influenceRemaining < 0}
            onClick={() => toggleNextTurnLock()}>
            <div className="flex flex-row items-center gap-2">
              {nextTurnLocked ? 'Unlock next turn' : 'Lock next turn'}
              {nextTurnLocked ? <Lock size={20} /> : <Unlock size={20} />}
            </div>
          </Button>
        )}
        <Button
          light
          loading={loading}
          onClick={() => setConfirmModalOpen(true)}>
          {hasStarted ? 'Resign' : 'Leave Game'}
        </Button>
      </div>
      <Modal open={confirmModalOpen} setOpen={setConfirmModalOpen}>
        <p className="mr-8">
          Are you sure you want to {hasStarted ? 'resign' : 'leave'}?
        </p>
        <div className="mt-4 flex justify-around self-center">
          <Button light onClick={() => setConfirmModalOpen(false)}>
            Cancel
          </Button>
          <Button
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
      </Modal>
    </div>
  );
};

export default GameActions;
