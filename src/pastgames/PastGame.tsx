import { useRouter } from 'next/router';
import { useContext } from 'react';

import Button from 'src/components/interactive/Button';
import HexagonalBoard from 'src/game/HexagonalBoard';
import { getColorForPlayer } from 'src/game/board-view-utils/boardColors';
import { getSpecialBorders } from 'src/game/board-view-utils/getSpecialBorders';
import { GameContext } from 'src/game/game-context/GameContext';

export default function PastGame() {
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

  const gameDuration =
    endedAt && startedAt && endedAt.seconds - startedAt.seconds;
  const gameDurationHours = gameDuration && Math.floor(gameDuration / 3600);
  const gameDurationMinutes =
    gameDuration && Math.floor((gameDuration % 3600) / 60);

  return (
    <div className="flex min-h-40 w-full max-w-2xl flex-col justify-between gap-4 rounded-2xl bg-zinc-800 p-4 sm:flex-row-reverse">
      <div className="flex flex-1 flex-row items-center justify-center gap-4 sm:flex-col">
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
          className="max-w-32 flex-1 sm:flex-none"
          light={winner != null}
          onClick={() => void router.push(`/games/${gameId}`)}>
          {winner ? 'View game' : hasStarted ? 'Rejoin Game' : 'Join Game'}
        </Button>
      </div>
      <div className="flex flex-col items-center justify-around gap-4 sm:flex-row">
        <HexagonalBoard
          className="h-full max-w-72 sm:h-48"
          board={getSpecialBorders(boardState, boardSize)}
          boardSize={boardSize}
        />
        <div className="flex w-32 flex-col items-center">
          <h3 className="self-center pb-2 text-xl font-medium">Players</h3>
          {players.map(({ id, name, hasResigned }) => (
            <p
              key={id}
              style={{ color: getColorForPlayer(id) }}
              className={`${id === winner ? 'font-bold' : ''} ${
                hasResigned ? 'italic' : ''
              }`}>
              {name}
              {id === winner ? ' (Won)' : ''}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
