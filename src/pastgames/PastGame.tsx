import { Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import Button from 'src/components/interactive/Button';
import { getColorForPlayer } from 'src/game/board-view-utils/boardColors';
import SimpleHexBoard from 'src/game/board/SimpleHexBoard';
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
      className={`delay ${delays[index]} flex w-full max-w-2xl flex-col justify-between gap-4 rounded-2xl bg-zinc-900 p-4 transition duration-300 sm:flex-row-reverse`}>
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
          {winner ? 'View game' : 'Rejoin Game'}
        </Button>
      </div>
      <div className="flex h-80 flex-col items-center justify-around gap-4 sm:h-44 sm:flex-row">
        <SimpleHexBoard board={boardState} boardSize={boardSize} />
        <div className="flex w-44 flex-col items-center gap-1">
          <h3 className="self-center pb-2 text-xl font-medium">Players</h3>
          {players.map(({ id, name, hasResigned }) => (
            <div className="flex items-center gap-1" key={id}>
              <p
                style={{ color: getColorForPlayer(id) }}
                className={`${
                  hasResigned ? 'opacity-60' : ''
                } max-w-36 overflow-hidden overflow-ellipsis text-nowrap`}>
                {name}
              </p>
              {id === winner && (
                <div className="rounded-full bg-violet-800 px-2 py-1">
                  <p className="text-xs font-bold">W</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Transition>
  );
}
