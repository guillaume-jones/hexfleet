import { useRouter } from 'next/router';
import { useIdToken } from 'react-firebase-hooks/auth';

import StyledLink from 'src/components/interactive/StyledLink';
import { auth } from 'src/firebase/firebaseApp';

const AnonymousGameWarning = ({ className }: { className?: string }) => {
  const [user] = useIdToken(auth);
  const router = useRouter();

  const replaceUrl = () => {
    const { login, ...newQuery } = router.query;
    void router.replace({ query: { ...newQuery, login: true } });
  };

  return user && user.isAnonymous ? (
    <p className={`text-center text-yellow-500 ${className}`}>
      You are not signed in. Please{' '}
      <StyledLink light onClick={replaceUrl}>
        create an account
      </StyledLink>{' '}
      to keep your games.
    </p>
  ) : null;
};

export default AnonymousGameWarning;
