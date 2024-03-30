import { useContext, useState } from 'react';

import AlignedBox from 'src/account/AlignedBox';
import Button from 'src/components/interactive/Button';
import Input from 'src/components/interactive/Input';
import LargeSpinner from 'src/components/other/LargeSpinner';
import { SettingsContext } from 'src/context/SettingsContext';

export default function ProfileBox() {
  const {
    name: profileName,
    updateProfile,
    loading,
  } = useContext(SettingsContext);

  const [name, setName] = useState(profileName ?? '');

  return (
    <>
      {loading ? (
        <LargeSpinner />
      ) : (
        <AlignedBox>
          {[
            <div
              key="name"
              className="flex w-full flex-row items-center justify-between gap-4">
              <h3>Display name</h3>
              <Input className="flex-1" value={name} setValue={setName} />
              <Button onClick={() => updateProfile({ name })}>Update</Button>
            </div>,
          ]}
        </AlignedBox>
      )}
    </>
  );
}
