import { Transition } from '@headlessui/react';
import { useIdToken } from 'react-firebase-hooks/auth';

import AlignedBox from 'src/account/AlignedBox';
import DeleteAccountLink from 'src/account/DeleteAccountLink';
import LogoutButton from 'src/account/LogoutButton';
import ResetPasswordButton from 'src/account/ResetPasswordButton';
import StyledLink from 'src/components/interactive/StyledLink';
import { auth } from 'src/firebase/firebaseApp';

export default function SecurityBox() {
  const [user, userLoading] = useIdToken(auth);

  return (
    <Transition
      enter="transition ease-out duration-500"
      enterFrom="opacity-0 scale-0"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-500"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-0"
      show={!userLoading}>
      <h2 className={'mb-2 text-xl font-semibold text-zinc-50'}>Security</h2>
      <AlignedBox>
        <>
          <p>Email: {user?.email}</p>
          <DeleteAccountLink />
        </>
        <div className="flex w-full flex-row justify-between">
          <ResetPasswordButton email={user?.email} />
          <LogoutButton />
        </div>
      </AlignedBox>
      <p className="mt-2">
        For any issues, please contact{' '}
        <StyledLink href="mailto:support@instantheader.com">
          support@instantheader.com
        </StyledLink>
        .
      </p>
    </Transition>
  );
}
