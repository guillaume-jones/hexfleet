import {
  and,
  collection,
  limit,
  or,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';

import Button from 'src/components/interactive/Button';
import { auth, firestore } from 'src/firebase/firebaseApp';

type GameCreationProps = {
  className?: string;
};

const RejoinButton = ({ className }: GameCreationProps) => {
  const [user] = useIdToken(auth);

  const [pastGames, loading] = useCollectionOnce(
    user &&
      query(
        collection(firestore, 'games'),
        and(
          or(
            where('players', 'array-contains', {
              id: user.uid,
              dead: false,
              sent: false,
            }),
            where('players', 'array-contains', {
              id: user.uid,
              dead: false,
              sent: true,
            }),
          ),
          where('winner', '==', null),
        ),
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
      href={`/game/${pastGames.docs[0].id}`}>
      Rejoin Game
    </Button>
  );
};

export default RejoinButton;
