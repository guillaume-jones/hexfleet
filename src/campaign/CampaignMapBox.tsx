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
import { defaultPlayer } from 'functions/src/game-logic/GameConstants';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { addPlayersToBoard } from 'functions/src/game-logic/addPlayersToBoard';

import Button from 'src/components/interactive/Button';
import LargeSpinner from 'src/components/other/LargeSpinner';
import { auth } from 'src/firebase/firebaseApp';
import SimpleHexBoard from 'src/game/board/SimpleHexBoard';
import { aiId, createCampaignGame } from 'src/game/create-game/createGame';

type CampaignMapProps = {
  mapId: string;
};

const CampaignMapBox = ({ mapId }: CampaignMapProps) => {
  const [user] = useIdToken(auth);
  const { campaign, loading: campaignLoading } = useCampaignDoc();

  const campaignMap = useMemo(
    () => getCampaignMapForUser(mapId, user?.uid),
    [mapId, user?.uid],
  );
  const { game, loading: gameLoading } = useCampaignGameDoc(mapId);

  const router = useRouter();
  const [redirectLoading, setRedirectLoading] = useState(false);

  const boardPreview = useMemo(() => {
    if (!campaignMap) return;

    let boardState = game?.boardState;
    if (!boardState) {
      const players = [
        { id: aiId, ...defaultPlayer },
        { id: user?.uid ?? 'abc', ...defaultPlayer },
      ];

      boardState = addPlayersToBoard({ ...campaignMap, players });
    }
    return addBordersToBoard(boardState, campaignMap.boardSize);
  }, [game, campaignMap, user?.uid]);

  const { achieved, upNext, locked } = useMemo(() => {
    const achieved = !!campaign?.achievedMaps?.includes(mapId);

    const index = campaignMaps.findIndex((v) => v.id === mapId);
    const maxAchievedIndex = campaignMaps.findLastIndex((v) =>
      campaign?.achievedMaps?.includes(v.id),
    );

    const upNext = index === maxAchievedIndex + 1;
    const locked = index > maxAchievedIndex + 1;

    return { achieved, upNext, locked };
  }, [campaign?.achievedMaps, mapId]);

  const inProgress = game?.endedAt === null;

  return (
    <div
      id={`campaign-map-${mapId}`}
      className={`relative flex min-h-96 min-w-80 flex-col items-center gap-4 rounded-lg bg-zinc-800 p-4 ${
        locked ? 'opacity-50' : ''
      }`}>
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
              light={!upNext && !inProgress}
              disabled={locked}
              loading={redirectLoading}
              onClick={() => {
                const asyncfunction = async () => {
                  const success = await createCampaignGame(campaignMap.id);

                  if (!success) throw Error('Failed to create campaign game.');

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
                      : 'Start Game'}
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
