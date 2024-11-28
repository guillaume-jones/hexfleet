import { useIdToken } from 'react-firebase-hooks/auth';

import { campaignMaps } from 'src/campaign/campaign-maps';
import { useCampaignDoc } from 'src/campaign/useCampaignDoc';
import { auth } from 'src/firebase/firebaseApp';
import {
  getColorForPlayer,
  getFillColor,
} from 'src/game/board-view-utils/boardColors';

const getCircleXY = (i: number) => {
  return {
    x: (100 / (campaignMaps.length - 1)) * i,
    y: Math.sin((i * 1.01 + 0.15) * Math.PI) * 9.5,
  };
};

const CampaignProgression = () => {
  const [user] = useIdToken(auth);
  const { campaign } = useCampaignDoc();

  const r = 4;
  const strokeWidth = 1;

  return (
    <svg
      className="h-full w-full select-none"
      viewBox={`${-r - strokeWidth / 2} -12 ${100 + 2 * r + strokeWidth} 24`}>
      {campaignMaps.map((campaignMap, i) => {
        const achieved = !!campaign?.achievedMaps?.includes(campaignMap.id);
        const nextMap = i === (campaign?.achievedMaps?.length ?? 0);

        const color = achieved ? getColorForPlayer(user?.uid) : '#52525b';
        const fillColor = getFillColor(color);

        const { x, y } = getCircleXY(i);
        const { x: nextX, y: nextY } = getCircleXY(i + 1);

        const delay = { transitionDelay: `${i * 100}ms` };
        const className = 'transition-all duration-200'; // cannot be applied to <g> element

        return (
          <g key={campaignMap.id}>
            {i !== campaignMaps.length - 1 && (
              <line
                className={className}
                style={delay}
                x1={x}
                y1={y}
                x2={nextX}
                y2={nextY}
                stroke={color}
                strokeWidth={strokeWidth}
              />
            )}
            <circle
              className={className}
              style={delay}
              r={r}
              cx={x}
              cy={y}
              strokeWidth={strokeWidth}
              stroke={nextMap ? getColorForPlayer(user?.uid) : color}
              fill={fillColor}
            />
            <>
              <line
                className={className}
                style={delay}
                x1={x - r / 3}
                y1={y}
                x2={x - r / 8}
                y2={y + r / 4}
                strokeLinecap={'round'}
                stroke={color}
                strokeWidth={1}
                opacity={achieved ? 1 : 0}
              />
              <line
                className={className}
                style={delay}
                x1={x - r / 8}
                y1={y + r / 4}
                x2={x + r / 3}
                y2={y - r / 3}
                strokeLinecap={'round'}
                stroke={color}
                strokeWidth={0.7}
                opacity={achieved ? 1 : 0}
              />
            </>
          </g>
        );
      })}
    </svg>
  );
};

export default CampaignProgression;
