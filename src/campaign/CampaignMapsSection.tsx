import { useEffect } from 'react';

import CampaignMapBox from './CampaignMapBox';
import { campaignMaps } from './campaign-maps';

const CampaignMapsSection = () => {
  const maxAchievedIndex = 3; // TODO: Use Firebase

  useEffect(() => {
    const nextMap = document.getElementById(
      `campaign-map-${Math.min(maxAchievedIndex + 1, campaignMaps.length - 1)}`,
    );
    const mapsContainer = document.getElementById('campaign-maps-container');

    if (!maxAchievedIndex || !mapsContainer || !nextMap) return;

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
        {campaignMaps.map((campaignMap, i) => (
          <CampaignMapBox
            key={campaignMap.id}
            campaignMap={campaignMap}
            index={i}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-20 bg-gradient-to-r from-zinc-950 from-10%  sm:block" />
      <div className="pointer-events-none absolute bottom-0 right-0  top-0 hidden w-20 bg-gradient-to-l from-zinc-950 from-10% sm:block" />
    </div>
  );
};

export default CampaignMapsSection;
