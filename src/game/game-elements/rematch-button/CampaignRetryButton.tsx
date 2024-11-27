import { createCampaignGame } from '../../create-game/createGame';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { aiId } from 'src/campaign/campaign-maps';
import { useCampaignGameDoc } from 'src/campaign/useCampaignGameDoc';
import Button from 'src/components/interactive/Button';

type CampaignRetryButtonProps = {
  onRematch?: () => void;
};

const CampaignRetryButton = ({ onRematch }: CampaignRetryButtonProps) => {
  const router = useRouter();

  const gameId = router.query.gameId as string;

  const { game, setGame, deleteGame } = useCampaignGameDoc(gameId);

  const [loading, setLoading] = useState(false);

  // Deletes game if user has lost & navigates away
  useEffect(() => {
    if (game?.winner !== aiId) return;

    return () => void deleteGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.winner]);

  return (
    <>
      <Button
        loading={loading}
        onClick={() => {
          const asyncFunction = async () => {
            if (game?.winner !== aiId) {
              await router.push('/campaign');
              return;
            }

            await deleteGame();

            const newGame = createCampaignGame(gameId);
            if (!newGame) throw Error('Failed to create campaign game.');

            await setGame(newGame);
          };

          setLoading(true);
          asyncFunction()
            .catch(console.error)
            .finally(() => {
              setLoading(false);
              onRematch?.();
            });
        }}>
        {game?.winner === aiId ? 'Try map again' : 'Back to campaign'}
      </Button>
    </>
  );
};

export default CampaignRetryButton;
