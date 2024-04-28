import { FirebaseError } from 'firebase/app';
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  linkWithCredential,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useCallback, useMemo, useState } from 'react';

import Button from 'src/components/interactive/Button';
import { auth } from 'src/firebase/firebaseApp';
import EmailField from 'src/login/email/EmailField';
import PasswordField from 'src/login/email/PasswordField';

export default function EmailLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const areFieldsValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && password.length >= 10,
    [email, password],
  );

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(email, password);

      if (user && user.isAnonymous) {
        linkWithCredential(user, credential).catch((e: FirebaseError) => {
          if (e.code === 'auth/email-already-in-use') {
            signInWithEmailAndPassword(auth, email, password).catch(() => {
              setShowError(true);
            });
            return;
          }
          setShowError(true);
        });
      }

      signInWithEmailAndPassword(auth, email, password).catch(
        (e: FirebaseError) => {
          if (e.code === 'auth/user-not-found') {
            createUserWithEmailAndPassword(auth, email, password).catch(() => {
              setShowError(true);
            });
          } else {
            setShowError(true);
          }
        },
      );
    },
    [email, password],
  );

  return (
    <form onSubmit={onSubmit} className="flex w-60 flex-col items-center gap-3">
      <EmailField email={email} setEmail={setEmail} />
      <PasswordField password={password} setPassword={setPassword} />
      <Button disabled={!areFieldsValid}>Sign in &nbsp; /&nbsp; Sign up</Button>
      <p
        className={`mb-4 text-center text-sm text-red-500 transition-all duration-300 ${
          showError ? 'h-10 opacity-100' : 'h-0 opacity-0'
        }`}>
        Incorrect email or password. You may have already signed up using a
        provider.
      </p>
    </form>
  );
}
