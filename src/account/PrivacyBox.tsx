import { useContext } from 'react';

import AlignedBox from 'src/account/AlignedBox';
import Checkbox from 'src/components/interactive/Checkbox';
import LargeSpinner from 'src/components/other/LargeSpinner';
import { SettingsContext } from 'src/context/SettingsContext';

export default function PrivacyBox() {
  const { isScorePublic, updateSettings, loading } =
    useContext(SettingsContext);

  return (
    <>
      {loading ? (
        <LargeSpinner />
      ) : (
        <AlignedBox>
          {[
            <Checkbox
              key={0}
              checked={!!isScorePublic}
              setChecked={() =>
                updateSettings({ isScorePublic: !isScorePublic })
              }
              label={'Show my wins & Elo on the public leaderboard'}
            />,
          ]}
        </AlignedBox>
      )}
    </>
  );
}
