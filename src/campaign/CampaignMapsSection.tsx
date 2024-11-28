import { clamp } from 'lodash';
import { useEffect } from 'react';

import CampaignMapBox from './CampaignMapBox';
import { campaignMaps } from './campaign-maps';
import { useCampaignDoc } from './useCampaignDoc';

const CampaignMapsSection = () => {
  const { campaign } = useCampaignDoc();

  const maxAchievedIndex = campaignMaps.findLastIndex((v) =>
    campaign?.achievedMaps?.includes(v.id),
  );

  useEffect(() => {
    if (maxAchievedIndex <= 0) return;

    const nextMap = document.getElementById(
      `campaign-map-${
        campaignMaps[clamp(maxAchievedIndex + 1, 0, campaignMaps.length - 1)].id
      }`,
    );
    const mapsContainer = document.getElementById('campaign-maps-container');

    if (!mapsContainer || !nextMap) return;

    mapsContainer.scrollTo({
      left:
        nextMap.offsetLeft +
        nextMap.offsetWidth / 2 -
        mapsContainer.offsetWidth / 2,
      behavior: 'smooth',
    });
  }, [maxAchievedIndex]);

  return (
    <div className="relative w-full">
      <div
        id="campaign-maps-container"
        className="relative flex w-full flex-col gap-12 py-6 sm:flex-row sm:overflow-x-scroll sm:px-20">
        {campaignMaps.map((campaignMap) => (
          <CampaignMapBox key={campaignMap.id} mapId={campaignMap.id} />
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-20 bg-gradient-to-r from-zinc-950 from-10%  sm:block" />
      <div className="pointer-events-none absolute bottom-0 right-0  top-0 hidden w-20 bg-gradient-to-l from-zinc-950 from-10% sm:block" />
    </div>
  );
};

export default CampaignMapsSection;
