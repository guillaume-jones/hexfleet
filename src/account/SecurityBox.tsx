import { User } from 'firebase/auth';

import AlignedBox from 'src/account/AlignedBox';
import DeleteAccountLink from 'src/account/DeleteAccountLink';
import LogoutButton from 'src/account/LogoutButton';
import ResetPasswordButton from 'src/account/ResetPasswordButton';
import LargeSpinner from 'src/components/other/LargeSpinner';

export default function SecurityBox({
  user,
}: {
  user: User | null | undefined;
}) {
  return (
    <>
      {!user && <LargeSpinner className="my-8 border-2 border-transparent" />}
      {user && (
        <AlignedBox light>
          <>
            <p>Email: {user.email}</p>
            <DeleteAccountLink />
          </>
          <>
            <ResetPasswordButton email={user.email} />
            <LogoutButton />
          </>
        </AlignedBox>
      )}
    </>
  );
}
