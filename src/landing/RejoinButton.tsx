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

type RejoinButtonProps = {
  className?: string;
};

const RejoinButton = ({ className }: RejoinButtonProps) => {
  const [user] = useIdToken(auth);

  const [pastGames] = useCollectionOnce(
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

  return (
    <Button
      light
      disabled={!pastGames || pastGames.empty}
      fontClassName="font-medium text-sm"
      className={`transition-all ${
        !pastGames || pastGames.empty ? 'opacity-0' : 'opacity-100'
      } ${className}`}
      href={`/game/${pastGames?.docs[0].id}`}>
      Rejoin Last Game
    </Button>
  );
};

export default RejoinButton;
