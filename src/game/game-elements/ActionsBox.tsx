import { GameContext } from '../game-context/GameContext';
import { useContext, useEffect, useState } from 'react';
import { ArrowRightCircle, RefreshCw, RotateCcw } from 'react-feather';
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
    hasStarted,
    gameId,
    nextTurn,
    nextTurnSent,
    nextTurnEqualsSent,
    influenceByPlayer,
    influenceRemaining,
    projectedInfluenceByPlayer,
    sendNextTurn,
    resetNextTurn,
    userId,
    setSelectedTile,
  } = useContext(GameContext);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        sendNextTurn()
          .then(() => {
            setSelectedTile(undefined);
          })
          .catch(console.error);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, setSelectedTile, sendNextTurn]);

  return (
    <div
      className={`flex w-auto select-none flex-col gap-3 rounded-xl bg-zinc-900 px-4
      py-3 transition-all ${className}
      `}>
      <h2 className="text-xl font-bold">Actions</h2>
      {hasStarted && (
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center ">
              <p>Influence left to spend:</p>
              <p
                className={`ml-2 font-bold ${
                  influenceRemaining < 0 ? 'text-red-500' : ''
                }`}>
                {influenceRemaining}
              </p>
              <p className="font-bold">/{influenceByPlayer[userId]}</p>
            </div>
            <div
              className={`flex items-center transition-opacity ${
                nextTurn ? 'opacity-75' : 'opacity-0'
              }`}>
              <p>Projected future influence:</p>
              <p className={'ml-2'}>{projectedInfluenceByPlayer[userId]}</p>
            </div>
          </div>
          <RotateCcw
            className={`ml-4 transition-opacity ${
              !nextTurnEqualsSent
                ? 'cursor-pointer hover:opacity-80 active:opacity-50'
                : 'opacity-0'
            }`}
            size={30}
            onClick={resetNextTurn}
          />
        </div>
      )}
      <div className="flex flex-row justify-between gap-3">
        {hasStarted && (
          <Button
            light={nextTurn && nextTurnEqualsSent}
            loading={sendLoading}
            disabled={!nextTurn || influenceRemaining < 0}
            onClick={() => {
              setSendLoading(true);
              sendNextTurn()
                .then(() => setSendLoading(false))
                .catch(console.error);
            }}>
            <div className="flex h-8 w-44 flex-row items-center justify-around gap-2 font-medium sm:h-auto">
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
      <Modal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        showX={false}>
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
