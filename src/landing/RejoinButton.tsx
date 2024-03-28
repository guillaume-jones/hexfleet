import { collection, limit, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';

import Button from 'src/components/interactive/Button';
import { auth, firestore } from 'src/firebase/firebaseApp';

type GameCreationProps = {
  className?: string;
};

const RejoinButton = ({ className }: GameCreationProps) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [pastGames, loading] = useCollectionOnce(
    user &&
      query(
        collection(firestore, 'games'),
        where('players', 'array-contains', {
          id: user.uid,
          hasResigned: false,
        }),
        where('winner', '==', null),
        orderBy('createdAt', 'desc'),
        limit(1),
      ),
  );

  return !pastGames || pastGames.empty ? null : (
    <Button
      light
      className={`transition-all ${
        pastGames ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      loading={loading}
      onClick={() => {
        const asyncFunction = async () => {
          if (!pastGames || pastGames.empty) return;
          await router.push(`/games/${pastGames.docs[0].id}`);
        };
        void asyncFunction();
      }}>
      Rejoin Game
    </Button>
  );
};

export default RejoinButton;
