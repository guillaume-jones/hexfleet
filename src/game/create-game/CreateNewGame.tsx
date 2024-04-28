import { signInAnonymously } from 'firebase/auth';
import range from 'lodash/range';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import {
  defaultPlayer,
  maximumPlayers,
  minimumPlayers,
} from 'functions/src/game-logic/GameConstants';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { addPlayersToBoard } from 'functions/src/game-logic/addPlayersToBoard';

import Button from 'src/components/interactive/Button';
import Range from 'src/components/interactive/Range';
import { auth } from 'src/firebase/firebaseApp';
import SimpleHexBoard from 'src/game/board/SimpleHexBoard';
import {
  defaultBoardOptions,
  generateBoard,
} from 'src/game/board/generateBoard';
import { createGame } from 'src/game/create-game/createGame';

type CreateNewGameProps = {
  onCancel: () => void;
};

const CreateNewGame = ({ onCancel }: CreateNewGameProps) => {
  const [user, userLoading] = useIdToken(auth);
  const router = useRouter();

  const [boardSize, setBoardSize] = useState(defaultBoardOptions.boardSize);
  const [playersCount, setPlayersCount] = useState(2);
  const [loading, setLoading] = useState(false);

  const boardPreview = useMemo(() => {
    const board = addPlayersToBoard({
      boardState: generateBoard({ boardSize }),
      boardSize,
      players: range(playersCount).map((i) => ({
        id: String(i * 8618), // Value chosen because colors look good
        ...defaultPlayer,
      })),
    });
    return addBordersToBoard(board, boardSize);
  }, [boardSize, playersCount]);

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
      <div className="flex flex-row justify-between">
        <p>Players:</p>
        <div className="flex gap-2">
          <p className="font-bold">{playersCount}</p>
          <Range
            value={playersCount}
            setValue={setPlayersCount}
            min={minimumPlayers}
            max={maximumPlayers}
          />
        </div>
      </div>
      <h3 className="text-center text-lg font-semibold">Preview</h3>
      <SimpleHexBoard board={boardPreview} boardSize={boardSize} />
      <div className="mt-2 flex justify-between">
        <Button light onClick={onCancel}>
          Cancel
        </Button>
        <Button
          loading={userLoading || loading}
          onClick={() => {
            const asyncFunction = async () => {
              if (userLoading) return;

              setLoading(true);

              if (!user) await signInAnonymously(auth);

              const id = await createGame({ boardSize });
              if (id) {
                await router.push(`/games/${id}`);
              } else {
                console.error('Failed to create game.');
              }

              setLoading(false);
            };
            void asyncFunction();
          }}>
          Confirm
        </Button>
      </div>
    </>
  );
};

export default CreateNewGame;
