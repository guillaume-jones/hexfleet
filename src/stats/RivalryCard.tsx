import { useEffect, useMemo, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import { getCurrentStreak } from './getGameHighScores';
import { GameOutcomes } from 'functions/src/document-types/Score';

import Modal from 'src/components/containers/Modal';
import Button from 'src/components/interactive/Button';
import { auth } from 'src/firebase/firebaseApp';
import { getNameForId } from 'src/game/board-view-utils/addNamesToPlayers';
import { getColorForPlayer } from 'src/game/board-view-utils/boardColors';
import CreateNewGame from 'src/game/create-game/CreateNewGame';

const RivalryCard = ({
  playerId,
  versus,
}: {
  playerId: string;
  versus: GameOutcomes;
}) => {
  const [user] = useIdToken(auth);
  const [name, setName] = useState('');
  const [newGameOpen, setNewGameOpen] = useState(false);

  useEffect(() => {
    getNameForId(playerId)
      .then((name) => setName(name))
      .catch(console.error);
  }, [playerId]);

  const { winPercent, lossPercent, streakLength, streakText } = useMemo(() => {
    const wins = versus.wins1v1;
    const losses = versus.losses1v1;
    const total = wins + losses;

    const currentStreak = getCurrentStreak(versus.pastGames);

    return {
      winPercent: (wins / total) * 100,
      lossPercent: (losses / total) * 100,
      streakLength: Math.abs(currentStreak),
      streakText:
        currentStreak < -1
          ? 'losses'
          : currentStreak < 0
          ? 'loss'
          : currentStreak > 1
          ? 'wins'
          : 'win',
    };
  }, [versus]);

  return (
    <div
      className={`flex w-80 flex-col gap-3 rounded-xl bg-zinc-900 p-4 ${
        name ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-200`}>
      <div className="flex items-center">
        <h3
          className="flex-1 text-lg font-semibold"
          style={{ color: getColorForPlayer(playerId) }}>
          {name}
        </h3>
        {user && (
          <>
            <Button onClick={() => setNewGameOpen(true)}>Invite to game</Button>
            <Modal
              open={newGameOpen}
              setOpen={setNewGameOpen}
              className="flex flex-col gap-2">
              <CreateNewGame
                onCancel={() => setNewGameOpen(false)}
                playerIds={[user.uid, playerId]}
              />
            </Modal>
          </>
        )}
      </div>
      <div>
        <div className="flex w-full justify-between pb-1">
          <p>Wins</p>
          <p>Losses</p>
        </div>
        <div className="flex h-5 w-full overflow-hidden rounded-md">
          <div
            className="flex items-center bg-green-600"
            style={{ width: `${winPercent}%` }}>
            <p className="ml-2 text-sm">{versus.wins1v1}</p>
          </div>
          <div
            className="flex items-center justify-end bg-zinc-600"
            style={{ width: `${lossPercent}%` }}>
            <p className="mr-2 text-sm">{versus.losses1v1}</p>
          </div>
        </div>
      </div>

      {streakLength !== 0 && (
        <p>
          Current streak: {streakLength} {streakText}
        </p>
      )}
    </div>
  );
};

export default RivalryCard;
