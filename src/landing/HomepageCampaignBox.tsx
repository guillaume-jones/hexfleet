import CampaignProgression from './CampaignProgression';

import { useCampaignDoc } from 'src/campaign/useCampaignDoc';
import Button from 'src/components/interactive/Button';

type HomepageCampaignBoxProps = {
  className?: string;
};

const HomepageCampaignBox = ({ className }: HomepageCampaignBoxProps) => {
  const { campaign, loading } = useCampaignDoc();

  return (
    <div
      className={`flex w-60 flex-col items-center gap-4 rounded-xl bg-zinc-900 p-4 ${className}`}>
      <CampaignProgression />
      <Button
        loading={loading}
        fontClassName="text-lg font-semibold"
        href="/campaign">
        {campaign ? 'Continue Campaign' : 'Start Campaign'}
      </Button>
    </div>
  );
};

export default HomepageCampaignBox;
