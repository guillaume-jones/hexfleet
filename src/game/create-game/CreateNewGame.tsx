import { signInAnonymously } from 'firebase/auth';
import range from 'lodash/range';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useHttpsCallable } from 'react-firebase-hooks/functions';

import { GameInviteData } from 'functions/src/game-functions/functionInputs';
import {
  defaultPlayer,
  maximumPlayers,
  minimumPlayers,
} from 'functions/src/game-logic/GameConstants';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { addPlayersToBoard } from 'functions/src/game-logic/addPlayersToBoard';

import Button from 'src/components/interactive/Button';
import Range from 'src/components/interactive/Range';
import { auth, functions } from 'src/firebase/firebaseApp';
import SimpleHexBoard from 'src/game/board/SimpleHexBoard';
import { generateBoard } from 'src/game/board/generateBoard';
import {
  createOnlineGame,
  createSinglePlayerGame,
  defaultGameOptions,
} from 'src/game/create-game/createGame';

type CreateNewGameProps = {
  onCancel: () => void;
  playerIds?: string[];
};

const CreateNewGame = ({ onCancel, playerIds }: CreateNewGameProps) => {
  const [user, userLoading] = useIdToken(auth);
  const router = useRouter();
  const [sendGameInvite] = useHttpsCallable<GameInviteData>(
    functions,
    'httpsCallable',
  );

  const [boardSize, setBoardSize] = useState(defaultGameOptions.boardSize);
  const [playerCount, setPlayerCount] = useState(
    playerIds?.length ?? defaultGameOptions.playerCount,
  );
  const [isMultiPlayer, setIsMultiplayer] = useState(false);
  const [loading, setLoading] = useState(false);

  const boardPreview = useMemo(() => {
    const players = (playerIds ?? range(0, 8618 * playerCount, 8618))?.map(
      (id) => ({ id: `${id}`, ...defaultPlayer }),
    );

    const boardState = generateBoard({ boardSize });
    const board = addPlayersToBoard({ boardState, boardSize, players });
    return addBordersToBoard(board, boardSize);
  }, [boardSize, playerIds, playerCount]);

  return (
    <>
      <h3 className="text-center text-lg font-semibold">Game options</h3>
      <div className="flex justify-between">
        <p>Board size:</p>
        <div className="flex gap-2">
          <p className="font-bold">{boardSize}</p>
          <Range
            value={boardSize}
            setValue={setBoardSize}
            min={5}
            max={21}
            step={2}
          />
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <Button
          light={isMultiPlayer}
          onClick={() => {
            setIsMultiplayer(false);
            setPlayerCount(2);
          }}>
          Singleplayer
        </Button>
        <Button light={!isMultiPlayer} onClick={() => setIsMultiplayer(true)}>
          Online
        </Button>
      </div>
      {!playerIds && isMultiPlayer && (
        <div className="flex flex-row justify-between">
          <p>Players:</p>
          <div className="flex gap-2">
            <p className="font-bold">{playerCount}</p>
            <Range
              value={playerCount}
              setValue={setPlayerCount}
              min={minimumPlayers}
              max={maximumPlayers}
            />
          </div>
        </div>
      )}
      <h3 className="text-center text-lg font-semibold">Preview</h3>
      <SimpleHexBoard board={boardPreview} boardSize={boardSize} />
      <div className="mt-2 flex justify-between">
        <Button light onClick={onCancel}>
          Cancel
        </Button>
        <Button
          loading={userLoading || loading}
          onClick={() => {
            setLoading(true);

            const asyncFunction = async () => {
              let userId = user?.uid;
              if (!userId) userId = (await signInAnonymously(auth)).user.uid;

              if (!isMultiPlayer) {
                const returned = createSinglePlayerGame({ boardSize });

                if (!returned) {
                  console.error('Failed to create game.');
                  return;
                }

                await router.push(`/singleplayer/${returned.id}`);

                return;
              }

              const returned = await createOnlineGame({ boardSize });

              if (!returned) {
                console.error('Failed to create game.');
                return;
              }

              if (playerIds) {
                await sendGameInvite({
                  shortId: returned.shortId,
                  fromPlayerId: userId,
                  toPlayerIds: playerIds,
                });
              }

              // 200ms delay to allow Firestore to update
              await new Promise((resolve) => setTimeout(resolve, 200));

              await router.push(
                `/game/${returned.id}${playerIds ? '?invites=true' : ''}`,
              );
            };
            void asyncFunction().finally(() => setLoading(false));
          }}>
          Confirm
        </Button>
      </div>
    </>
  );
};

export default CreateNewGame;
