import { useCallback, useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';

import Button from 'src/components/interactive/Button';
import { auth } from 'src/firebase/firebaseApp';

export default function ResetPasswordButton({
  email,
}: {
  email: string | null | undefined;
}) {
  const [sendPasswordResetEmail, sendingResetEmail, error] =
    useSendPasswordResetEmail(auth);
  const [emailSent, setEmailSent] = useState(false);

  const resetEmail = useCallback(() => {
    const sendEmail = async (email: string) => {
      const emailSent = await sendPasswordResetEmail(email);

      if (emailSent) {
        setEmailSent(true);
      }
    };

    if (email) {
      sendEmail(email).catch((e) => console.error(e));
    }
  }, [sendPasswordResetEmail, email]);

  return (
    <div>
      <Button
        className="w-full sm:w-auto"
        onClick={resetEmail}
        disabled={emailSent}
        loading={sendingResetEmail}>
        {emailSent ? 'Email sent!' : 'Change password'}
      </Button>
      <p
        className={`mt-1 text-center text-sm text-red-500 transition-all duration-300 ${
          error ? 'h-4 opacity-100' : 'h-0 opacity-0'
        }`}>
        Error, please try again.
      </p>
    </div>
  );
}
