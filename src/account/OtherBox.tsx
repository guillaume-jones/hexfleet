import { useCallback } from 'react';

import AlignedBox from 'src/account/AlignedBox';
import Checkbox from 'src/components/interactive/Checkbox';
import LargeSpinner from 'src/components/other/LargeSpinner';
import { useSettingsContext } from 'src/context/SettingsContext';

export default function OtherBox() {
  const [settings, updateSettings] = useSettingsContext();

  const handleProductEmailsChange = useCallback(() => {
    updateSettings({ receiveProductEmails: !settings?.receiveProductEmails });
  }, [settings?.receiveProductEmails, updateSettings]);

  return (
    <>
      {!settings && <LargeSpinner className="" />}
      {settings && (
        <AlignedBox>
          {[
            <Checkbox
              key={0}
              checked={!!settings.receiveProductEmails}
              setChecked={handleProductEmailsChange}
              label={'Receive emails about new features'}
            />,
          ]}
        </AlignedBox>
      )}
    </>
  );
}
