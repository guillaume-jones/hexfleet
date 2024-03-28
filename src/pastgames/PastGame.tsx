import { useRouter } from 'next/router';

import { Game } from 'functions/src/document-types/Games';

import Button from 'src/components/interactive/Button';
import HexagonalBoard from 'src/game/HexagonalBoard';
import { getColorForPlayer } from 'src/game/board-view-utils/boardColors';
import { getSpecialBorders } from 'src/game/board-view-utils/getBorders';

type PastGameProps = {
  game: Game;
  gameId: string;
};

export default function PastGame({
  gameId,
  game: {
    boardState,
    boardSize,
    players,
    winner,
    createdAt,
    endedAt,
    startedAt,
  },
}: PastGameProps) {
  const router = useRouter();

  const gameDuration =
    endedAt && startedAt && endedAt.seconds - startedAt.seconds;
  const gameDurationHours = gameDuration && Math.floor(gameDuration / 3600);
  const gameDurationMinutes =
    gameDuration && Math.floor((gameDuration % 3600) / 60);

  return (
    <div className="flex min-h-40 w-full max-w-xl flex-col justify-between gap-4 rounded-xl bg-zinc-800 p-4 sm:flex-row-reverse">
      <div className="flex flex-1 flex-row items-center justify-center gap-4 sm:flex-col">
        <div className="flex flex-col items-center">
          <p className="text-lg">
            {createdAt.toDate().toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
            {', '}
            {createdAt.toDate().toLocaleTimeString(undefined, {
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
          ) : (
            <p className="text-lg text-violet-600">Game in progress</p>
          )}
        </div>
        <Button
          className="max-w-32 flex-1 sm:flex-none"
          light={winner != null}
          onClick={() => void router.push(`/games/${gameId}`)}>
          {winner ? 'View game' : 'Rejoin Game'}
        </Button>
      </div>
      <div className="flex flex-col items-center justify-around gap-4 sm:flex-row">
        <HexagonalBoard
          className="h-full max-w-72 sm:h-48"
          board={getSpecialBorders(boardState, boardSize)}
          boardSize={boardSize}
        />
        <div>
          <h3 className="pb-2 text-xl font-medium">Players</h3>
          {players.map(({ id, hasResigned }) => (
            <p
              key={id}
              style={{ color: getColorForPlayer(id) }}
              className={`${id === winner ? 'font-bold' : ''} ${
                hasResigned ? 'italic' : ''
              }`}>
              {id.slice(0, 6)}
              {id === winner ? ' (Won)' : ''}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
