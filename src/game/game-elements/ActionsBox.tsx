import { GameContext } from '../game-context/GameContext';
import { useContext, useEffect, useState } from 'react';
import { ArrowRightCircle, RefreshCw } from 'react-feather';
import { useHttpsCallable } from 'react-firebase-hooks/functions';

import { EditGamePlayerData } from 'functions/src/document-types/Games';

import Modal from 'src/components/containers/Modal';
import Button from 'src/components/interactive/Button';
import { functions } from 'src/firebase/firebaseApp';

type ActionsBoxProps = {
  className?: string;
};

const ActionsBox = ({ className }: ActionsBoxProps) => {
  const [editGamePlayer, loading] = useHttpsCallable<EditGamePlayerData>(
    functions,
    'editGamePlayer',
  );

  const {
    winner,
    shortId,
    hasStarted,
    gameId,
    nextTurnSent,
    nextTurnEqualsSent,
    influenceByPlayer,
    influenceRemaining,
    projectedInfluenceByPlayer,
    sendNextTurn,
    userId,
  } = useContext(GameContext);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        sendNextTurn().catch(console.error);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, sendNextTurn]);

  if (!shortId || winner) return null;

  return (
    <div
      className={`flex w-auto flex-col gap-2 rounded-xl bg-zinc-800 px-4 py-3
      transition-all ${className}
      `}>
      <h2 className="text-xl font-bold">Actions</h2>
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
      <div className="flex flex-row justify-between gap-3">
        {hasStarted && (
          <Button
            light={nextTurnEqualsSent}
            loading={sendLoading}
            disabled={influenceRemaining < 0}
            onClick={() => {
              setSendLoading(true);
              sendNextTurn()
                .then(() => {
                  setSendLoading(false);
                })
                .catch(console.error);
            }}>
            <div className="flex w-40 flex-row items-center justify-around gap-2 font-medium">
              {nextTurnSent ? 'Re-send next turn' : 'Send next turn'}
              {nextTurnSent ? (
                <RefreshCw size={20} />
              ) : (
                <ArrowRightCircle size={20} />
              )}
            </div>
          </Button>
        )}
        <Button light onClick={() => setConfirmModalOpen(true)}>
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
      </Modal>
    </div>
  );
};

export default ActionsBox;
