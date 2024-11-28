import {
  ArrowPathIcon,
  CheckCircleIcon,
  LockClosedIcon,
} from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import { campaignMaps, getCampaignMapForUser } from './campaign-maps';
import { useCampaignDoc } from './useCampaignDoc';
import { useCampaignGameDoc } from './useCampaignGameDoc';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';

import Button from 'src/components/interactive/Button';
import LargeSpinner from 'src/components/other/LargeSpinner';
import { auth } from 'src/firebase/firebaseApp';
import SimpleHexBoard from 'src/game/board/SimpleHexBoard';
import { createCampaignGame } from 'src/game/create-game/createGame';

type CampaignMapProps = {
  mapId: string;
};

const CampaignMapBox = ({ mapId }: CampaignMapProps) => {
  const [user] = useIdToken(auth);

  const router = useRouter();
  const [redirectLoading, setRedirectLoading] = useState(false);

  const { campaign, loading: campaignLoading } = useCampaignDoc();
  const { game, setGame, loading: gameLoading } = useCampaignGameDoc(mapId);

  const campaignMap = useMemo(
    () => getCampaignMapForUser(mapId, user?.uid),
    [mapId, user?.uid],
  );
  const boardPreview = useMemo(
    () =>
      addBordersToBoard(
        game?.boardState ?? campaignMap?.boardState,
        campaignMap?.boardSize,
      ),
    [campaignMap, game?.boardState],
  );

  const { achieved, upNext, locked } = useMemo(() => {
    const achieved = !!campaign?.achievedMaps?.includes(mapId);

    const index = campaignMaps.findIndex((v) => v.id === mapId);
    const maxAchievedIndex = campaignMaps.findLastIndex((v) =>
      campaign?.achievedMaps?.includes(v.id),
    );

    const upNext = maxAchievedIndex !== -1 && index === maxAchievedIndex + 1;
    const locked = index > maxAchievedIndex + 2;

    return { achieved, upNext, locked };
  }, [campaign?.achievedMaps, mapId]);

  const inProgress = game?.endedAt === null;

  return (
    <div
      id={`campaign-map-${mapId}`}
      className={`relative flex min-h-96 min-w-80 flex-col items-center gap-4 rounded-lg  ${
        upNext ? 'bg-violet-950 bg-opacity-50' : 'bg-zinc-900'
      } p-4 ${locked ? 'opacity-50' : ''} ${achieved ? 'bg-opacity-50' : ''}`}>
      <h3
        className={`text-xl font-semibold ${achieved ? 'text-green-400' : ''}`}>
        {campaignMap?.title}
      </h3>
      {achieved && (
        <CheckCircleIcon className="absolute right-5 top-5 h-6 w-6 text-green-500" />
      )}
      {campaignLoading || gameLoading || !campaignMap ? (
        <LargeSpinner className="flex flex-1 items-center" />
      ) : (
        <>
          <SimpleHexBoard
            board={boardPreview}
            boardSize={campaignMap.boardSize}
          />
          <div className="flex flex-row justify-center gap-4">
            <Button
              className="w-36"
              light={!upNext}
              disabled={locked}
              loading={redirectLoading}
              onClick={() => {
                const asyncfunction = async () => {
                  const game = createCampaignGame(campaignMap.id);

                  if (!game) throw Error('Failed to create campaign game.');

                  await setGame(game);
                  await router.push(`/campaign/${campaignMap.id}`);
                };

                setRedirectLoading(true);
                asyncfunction()
                  .catch(console.error)
                  .finally(() => setRedirectLoading(false));
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
                      : upNext
                      ? 'Start Game'
                      : 'Skip to Map'}
                  </p>
                )}
                {achieved && !inProgress && (
                  <ArrowPathIcon className="h-6 w-6 text-zinc-950" />
                )}
              </div>
            </Button>
            {game?.winner && (
              <Button
                light
                onClick={() => void router.push(`/campaign/${campaignMap.id}`)}>
                View Game
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CampaignMapBox;
