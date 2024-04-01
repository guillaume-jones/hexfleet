import { Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import Button from 'src/components/interactive/Button';
import HexagonalBoard from 'src/game/HexagonalBoard';
import { getColorForPlayer } from 'src/game/board-view-utils/boardColors';
import { GameContext } from 'src/game/game-context/GameContext';

export type PastGameProps = {
  index: number;
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

export default function PastGame({ index }: PastGameProps) {
  const router = useRouter();

  const {
    gameId,
    userId,
    boardSize,
    boardState,
    createdAt,
    endedAt,
    hasStarted,
    players,
    startedAt,
    winner,
  } = useContext(GameContext);

  const [loading, setLoading] = useState(false);

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
      show={true}
      appear
      className={`delay ${delays[index]} flex min-h-40 w-full max-w-xl flex-col justify-between gap-4 rounded-2xl bg-zinc-800 p-4 transition duration-300 sm:flex-row-reverse`}>
      <div className="flex flex-1 flex-row items-center justify-around gap-4 sm:flex-col">
        <div className="flex flex-col items-center">
          <p className="text-lg">
            {createdAt?.toDate().toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
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
              Game lasted {gameDurationHours ? `${gameDurationHours} h ` : ''}
              {gameDurationMinutes} min
            </p>
          ) : hasStarted ? (
            <p className="text-lg text-violet-600">Game in progress</p>
          ) : (
            <p className="text-lg text-violet-300">Not yet started</p>
          )}
        </div>
        <Button
          loading={loading}
          className="max-w-32 flex-1 sm:flex-none"
          light={winner != null}
          onClick={() => {
            setLoading(true);
            void router.push(`/games/${gameId}`);
          }}>
          {winner ? 'View game' : hasStarted ? 'Rejoin Game' : 'Join Game'}
        </Button>
      </div>
      <div className="flex flex-col items-center justify-around gap-4 sm:flex-row">
        <HexagonalBoard
          className="h-full max-w-72 sm:h-40"
          board={boardState}
          boardSize={boardSize}
          userId={userId}
        />
        <div className="flex w-40 flex-col items-center">
          <h3 className="self-center pb-2 text-xl font-medium">Players</h3>
          {players.map(({ id, name, hasResigned }) => (
            <p
              key={id}
              style={{ color: getColorForPlayer(id) }}
              className={`${id === winner ? 'font-bold' : ''} ${
                hasResigned ? 'italic' : ''
              } max-w-40 overflow-hidden overflow-ellipsis text-nowrap`}>
              {name}
              {id === winner ? ' (Won)' : ''}
            </p>
          ))}
        </div>
      </div>
    </Transition>
  );
}
