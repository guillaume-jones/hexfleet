import { Transition } from '@headlessui/react';
import { useContext } from 'react';

import DeleteGame from './DeleteGame';

import Button from 'src/components/interactive/Button';
import { getColorForPlayer } from 'src/game/board-view-utils/boardColors';
import SimpleHexBoard from 'src/game/board/SimpleHexBoard';
import { GameContext } from 'src/game/game-context/GameContext';
import WinnerChip from 'src/game/game-elements/WinnerChip';

export type PastGameProps = {
  index: number;
  removeGame: (gameId: string) => void;
};

// For Tailwind compilation
const delays = [
  'delay-[0ms]',
  'delay-[50ms]',
  'delay-[100ms]',
  'delay-[150ms]',
  'delay-[200ms]',
  'delay-[250ms]',
  'delay-[300ms]',
  'delay-[350ms]',
  'delay-[400ms]',
  'delay-[450ms]',
  'delay-[500ms]',
];

export default function PastGame({ index, removeGame }: PastGameProps) {
  const {
    gameId,
    boardSize,
    projectedBoard,
    createdAt,
    endedAt,
    hasStarted,
    players,
    startedAt,
    winner,
  } = useContext(GameContext);

  const gameDuration =
    endedAt && startedAt && endedAt.seconds - startedAt.seconds;
  const gameDurationHours = gameDuration && Math.floor(gameDuration / 3600);
  const gameDurationMinutes =
    gameDuration && Math.floor((gameDuration % 3600) / 60);

  return (
    <Transition
      enter=" ease-out "
      enterFrom="opacity-0"
      enterTo="opacity-100"
      show={players.length > 0}
      appear
      className={`${delays[index]} flex w-full max-w-3xl flex-col justify-between gap-4 rounded-2xl bg-zinc-900 p-4 transition duration-300 sm:flex-row-reverse`}>
      <div className="flex flex-1 flex-row items-center justify-around gap-4 sm:w-44 sm:flex-col">
        <div className="flex flex-col sm:items-center">
          <p className="text-lg">
            {createdAt?.toDate().toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
            })}
            {', '}
            {createdAt?.toDate().toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </p>
          {gameDuration ? (
            <p className="text-lg">
              Lasted {gameDurationHours ? `${gameDurationHours} h ` : ''}
              {gameDurationMinutes} min
            </p>
          ) : hasStarted ? (
            <p className="text-lg text-violet-600">In progress</p>
          ) : (
            <p className="text-lg text-violet-300">Not started</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="max-w-32 flex-1 sm:flex-none"
            light={winner != null}
            href={`/game?id=${gameId}`}>
            {winner ? 'View game' : 'Rejoin Game'}
          </Button>
          {hasStarted === false && (
            <DeleteGame
              gameId={gameId}
              onDelete={() => {
                removeGame(gameId);
              }}
            />
          )}
        </div>
      </div>
      <div className="flex h-80 flex-col items-center justify-around gap-4 sm:h-44 sm:flex-row">
        <SimpleHexBoard board={projectedBoard} boardSize={boardSize} />
        <div className="flex w-44 flex-col items-center gap-1">
          <h3 className="self-center pb-2 text-xl font-medium">Players</h3>
          {players.map(({ id, name, dead }) => (
            <div className="flex items-center gap-1" key={id}>
              <p
                style={{ color: getColorForPlayer(id) }}
                className={`${
                  dead ? 'line-through opacity-60' : ''
                } max-w-36 overflow-hidden overflow-ellipsis text-nowrap`}>
                {name}
              </p>
              {id === winner && <WinnerChip />}
            </div>
          ))}
        </div>
      </div>
    </Transition>
  );
}
