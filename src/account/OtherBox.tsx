import { useCallback, useContext } from 'react';

import AlignedBox from 'src/account/AlignedBox';
import Checkbox from 'src/components/interactive/Checkbox';
import LargeSpinner from 'src/components/other/LargeSpinner';
import { SettingsContext } from 'src/context/SettingsContext';

export default function OtherBox() {
  const { isOnLeaderboard, updateSettings, settingsLoading } =
    useContext(SettingsContext);

  const handleIsOnLeaderboardChange = useCallback(() => {
    updateSettings({ isOnLeaderboard: !isOnLeaderboard });
  }, [isOnLeaderboard, updateSettings]);

  return (
    <>
      {settingsLoading ? (
        <LargeSpinner className="" />
      ) : (
        <AlignedBox>
          {[
            <Checkbox
              key={0}
              checked={!!isOnLeaderboard}
              setChecked={handleIsOnLeaderboardChange}
              label={'Show my wins on the public leaderboard'}
            />,
          ]}
        </AlignedBox>
      )}
    </>
  );
}
