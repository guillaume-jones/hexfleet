import { Transition } from '@headlessui/react';
import { useContext, useEffect, useState } from 'react';
import { CheckCircle } from 'react-feather';

import AlignedBox from 'src/account/AlignedBox';
import Button from 'src/components/interactive/Button';
import Input from 'src/components/interactive/Input';
import { SettingsContext } from 'src/context/SettingsContext';

const maxNameLength = 16;

export default function ProfileBox() {
  const {
    name: profileName,
    updateProfile,
    loading,
  } = useContext(SettingsContext);

  const [name, setName] = useState('');
  const [showCheck, setShowCheck] = useState(false);

  // Needed to keep in sync
  useEffect(() => {
    if (profileName) setName(profileName);
  }, [profileName]);

  return (
    <Transition
      enter="transition ease-out duration-500"
      enterFrom="opacity-0 scale-0"
      enterTo="opacity-100 scale-100"
      show={!loading}>
      <h2 className={'mb-2 text-xl font-semibold text-zinc-50'}>Profile</h2>
      <AlignedBox>
        {[
          <div
            key="name"
            className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
            <h3>Display name</h3>
            <Input
              inputProps={{ maxLength: maxNameLength }}
              className={`flex-1 ${
                name.length === maxNameLength ? ' outline-red-500' : ''
              }`}
              value={name}
              setValue={setName}
            />
            <Button
              loading={loading}
              onClick={() => {
                updateProfile({ name });
                setShowCheck(true);
                setTimeout(() => setShowCheck(false), 1000);
              }}>
              <Transition
                show={showCheck}
                className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center rounded-xl bg-violet-700"
                enter="transition-opacity duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <CheckCircle size={24} />
              </Transition>
              Update
            </Button>
          </div>,
        ]}
      </AlignedBox>
    </Transition>
  );
}
