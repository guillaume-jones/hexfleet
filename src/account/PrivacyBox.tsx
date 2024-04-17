import { Transition } from '@headlessui/react';
import { useContext } from 'react';

import AlignedBox from 'src/account/AlignedBox';
import Checkbox from 'src/components/interactive/Checkbox';
import { SettingsContext } from 'src/context/SettingsContext';

export default function PrivacyBox() {
  const { isScorePublic, updateSettings, loading } =
    useContext(SettingsContext);

  return (
    <Transition
      enter="transition ease-out duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      show={!loading}>
      <h2 className={'mb-2 text-xl font-semibold text-zinc-50'}>Privacy</h2>
      <AlignedBox>
        {[
          <Checkbox
            key={0}
            checked={!!isScorePublic}
            setChecked={() => updateSettings({ isScorePublic: !isScorePublic })}
            label={
              'Show my wins & Elo on the public leaderboard (coming soon!)'
            }
          />,
        ]}
      </AlignedBox>
    </Transition>
  );
}
