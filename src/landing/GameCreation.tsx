import { Transition } from '@headlessui/react';
import range from 'lodash/range';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

import Button from 'src/components/interactive/Button';
import Range from 'src/components/interactive/Range';
import HexagonalBoard from 'src/game/HexagonalBoard';
import { addPlayersToBoard } from 'src/game/board-utils/addPlayersToBoard';
import {
  defaultBoardOptions,
  generateBoard,
} from 'src/game/board-utils/generateBoard';
import { getSpecialBorders } from 'src/game/board-view-utils/getBorders';
import { createGame } from 'src/game/game-utils/createGame';

type GameCreationProps = {
  className?: string;
};

const GameCreation = ({ className }: GameCreationProps) => {
  const router = useRouter();
  const [show, setShown] = useState(false);

  const [boardSize, setBoardSize] = useState(defaultBoardOptions.boardSize);
  const [playersCount, setPlayersCount] = useState(2);

  const boardPreview = useMemo(() => {
    const board = addPlayersToBoard({
      board: generateBoard({ boardSize }),
      boardSize,
      players: range(playersCount).map((i) => String(i * 8618)),
    });
    return getSpecialBorders(board, boardSize);
  }, [boardSize, playersCount]);

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <Button onClick={() => setShown(true)}>Create Game</Button>
      <Transition
        className="flex w-64 flex-col gap-2 overflow-hidden rounded-lg bg-zinc-800 p-3 transition-all duration-500"
        enter="ease-out"
        enterFrom="opacity-0 max-h-0"
        enterTo="opacity-100 max-h-96"
        leave="ease-in"
        leaveFrom="opacity-100 max-h-96"
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
        <HexagonalBoard board={boardPreview} boardSize={boardSize} />
        <div className="flex justify-between">
          <Button
            light
            onClick={() => {
              setShown(false);
            }}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              const id = await createGame({ boardSize });
              if (id) {
                router.push(`/games/${id}`);
              }
            }}>
            Confirm
          </Button>
        </div>
      </Transition>
    </div>
  );
};

export default GameCreation;
