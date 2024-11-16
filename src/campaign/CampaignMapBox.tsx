import {
  ArrowPathIcon,
  CheckCircleIcon,
  LockClosedIcon,
} from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import { CampaignMap } from './campaign-maps';
import { defaultPlayer } from 'functions/src/game-logic/GameConstants';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { addPlayersToBoard } from 'functions/src/game-logic/addPlayersToBoard';

import Button from 'src/components/interactive/Button';
import { auth } from 'src/firebase/firebaseApp';
import SimpleHexBoard from 'src/game/board/SimpleHexBoard';
import { aiId } from 'src/game/create-game/createGame';
import { spGameKey } from 'src/game/game-context/useCampaignGame';

type CampaignMapProps = {
  campaignMap: CampaignMap;
  index: number;
};

const CampaignMapBox = ({ campaignMap, index }: CampaignMapProps) => {
  const [user] = useIdToken(auth);
  const router = useRouter();

  const boardPreview = useMemo(() => {
    const players = [
      { id: user?.uid ?? 'abc', ...defaultPlayer },
      { id: aiId, ...defaultPlayer },
    ];

    const board = addPlayersToBoard({ ...campaignMap, players });
    return addBordersToBoard(board, campaignMap.boardSize);
  }, [campaignMap, user?.uid]);

  const achieved = index <= 3; // TODO: Use Firebase
  const maxAchievedIndex = 3; // TODO: Use Firebase

  const { inProgress, upNext, locked } = useMemo(() => {
    const inProgress =
      typeof window !== 'undefined' &&
      localStorage?.getItem(spGameKey(campaignMap.id)) !== null;

    const upNext = index === maxAchievedIndex + 1;
    const locked = index > maxAchievedIndex + 1;

    return { inProgress, upNext, locked };
  }, [campaignMap.id, index]);

  return (
    <div
      id={`campaign-map-${index}`}
      className={`relative flex min-w-80 flex-col items-center gap-4 rounded-lg bg-zinc-800 p-4 ${
        locked ? 'opacity-50' : ''
      }`}>
      <h3
        className={`text-xl font-semibold ${achieved ? 'text-green-400' : ''}`}>
        {campaignMap.title}
      </h3>
      {achieved && (
        <CheckCircleIcon className="absolute right-5 top-5 h-6 w-6 text-green-500" />
      )}
      <SimpleHexBoard board={boardPreview} boardSize={campaignMap.boardSize} />
      <Button
        className="w-36"
        light={!upNext}
        disabled={locked}
        onClick={() => {
          router.push(`/campaign/${campaignMap.id}`).catch(console.error);
        }}>
        <div className="flex flex-row gap-2">
          {locked ? (
            <LockClosedIcon className="h-6 w-6 text-zinc-950" />
          ) : (
            <p>
              {inProgress
                ? 'Continue Game'
                : achieved
                ? 'Play Again'
                : 'Start Game'}
            </p>
          )}
          {achieved && <ArrowPathIcon className="h-6 w-6 text-zinc-950" />}
        </div>
      </Button>
    </div>
  );
};

export default CampaignMapBox;
