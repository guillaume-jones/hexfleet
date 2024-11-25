import { useRouter } from 'next/router';

import CampaignRetryButton from './CampaignRetryButton';
import MultiplayerRematchButton from './MultiplayerRematchButton';

type RematchButtonProps = {
  onRematch?: () => void;
};

const RematchButton = ({ onRematch }: RematchButtonProps) => {
  const router = useRouter();
  const isCampaign = router.pathname.includes('campaign');

  return isCampaign ? (
    <CampaignRetryButton onRematch={onRematch} />
  ) : (
    <MultiplayerRematchButton />
  );
};

export default RematchButton;
