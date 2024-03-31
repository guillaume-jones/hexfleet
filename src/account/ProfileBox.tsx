import { Transition } from '@headlessui/react';
import { useContext, useEffect, useState } from 'react';

import AlignedBox from 'src/account/AlignedBox';
import Button from 'src/components/interactive/Button';
import Input from 'src/components/interactive/Input';
import { SettingsContext } from 'src/context/SettingsContext';

export default function ProfileBox() {
  const {
    name: profileName,
    updateProfile,
    loading,
  } = useContext(SettingsContext);

  const [name, setName] = useState('');

  useEffect(() => {
    if (profileName) setName(profileName);
  }, [profileName]);

  return (
    <Transition
      enter="transition ease-out duration-500"
      enterFrom="opacity-0 scale-0"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-500"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-0"
      show={!loading}>
      <h2 className={'mb-2 text-xl font-semibold text-zinc-50'}>Profile</h2>
      <AlignedBox>
        {[
          <div
            key="name"
            className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
            <h3>Display name</h3>
            <Input
              inputProps={{ maxLength: 20 }}
              className="flex-1"
              value={name}
              setValue={setName}
            />
            <Button onClick={() => updateProfile({ name })}>Update</Button>
          </div>,
        ]}
      </AlignedBox>
    </Transition>
  );
}
