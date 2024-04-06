import { Transition } from '@headlessui/react';
import range from 'lodash/range';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

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
import { createGame } from 'src/game/game-utils/createGame';
import { loginUrlQuery } from 'src/layout/navbar/AccountButton';

type GameCreationProps = {
  className?: string;
};

const GameCreation = ({ className }: GameCreationProps) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [show, setShown] = useState(false);
  const [boardSize, setBoardSize] = useState(defaultBoardOptions.boardSize);
  const [playersCount, setPlayersCount] = useState(2);

  const boardPreview = useMemo(() => {
    const board = addPlayersToBoard({
      boardState: generateBoard({ boardSize }),
      boardSize,
      players: range(playersCount).map((i) => ({
        id: String(i * 8618), // Value chosen because colors look good
      })),
    });
    return addBordersToBoard(board, boardSize);
  }, [boardSize, playersCount]);

  return (
    <div className={`flex w-64 flex-col items-center gap-4 ${className}`}>
      <Button
        fontClassName="text-lg font-semibold"
        onClick={() => setShown(true)}>
        Create Game
      </Button>
      <Transition
        className="flex w-full flex-col gap-3 overflow-hidden rounded-lg bg-zinc-800 p-3 transition-all duration-500"
        enter="ease-out"
        enterFrom="opacity-0 max-h-0"
        enterTo="opacity-100 max-h-[420px]"
        leave="ease-in"
        leaveFrom="opacity-100 max-h-[420px]"
        leaveTo="opacity-0 max-h-0"
        show={show}>
        <h3 className="text-center text-lg font-semibold">Game options</h3>
        <div className="flex justify-between">
          <p>Board size:</p>
          <div className="flex gap-2">
            <p className="font-bold">{boardSize}</p>
            <Range
              value={boardSize}
              setValue={setBoardSize}
              min={5}
              max={31}
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
              min={2}
              max={6}
            />
          </div>
        </div>
        <h3 className="text-center text-lg font-semibold">Preview</h3>
        <SimpleHexBoard board={boardPreview} boardSize={boardSize} />
        <div className="flex justify-between">
          <Button light onClick={() => setShown(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const asyncFunction = async () => {
                if (!user) {
                  await router.push(`/${loginUrlQuery}`);
                  return;
                }
                const id = await createGame({ boardSize });
                if (id) {
                  await router.push(`/games/${id}`);
                } else {
                  console.error('Failed to create game.');
                }
              };
              void asyncFunction();
            }}>
            Confirm
          </Button>
        </div>
      </Transition>
    </div>
  );
};

export default GameCreation;
