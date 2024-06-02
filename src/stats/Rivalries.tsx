import { doc } from 'firebase/firestore';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import RivalryCard from './RivalryCard';
import { Score } from 'functions/src/document-types/Score';

import LargeSpinner from 'src/components/other/LargeSpinner';
import { auth, firestore } from 'src/firebase/firebaseApp';

const Rivalries = () => {
  const [user] = useIdToken(auth);
  const [userScore] = useDocumentData<Partial<Score>>(
    user && doc(firestore, 'scores', user.uid),
  );

  return (
    <div>
      <h2 className="mb-4 text-center text-2xl font-semibold">Rivalries</h2>
      <div className="flex flex-col gap-2">
        {userScore?.versus ? (
          Object.entries(userScore.versus).map(([playerId, versus]) => (
            <RivalryCard key={playerId} versus={versus} playerId={playerId} />
          ))
        ) : (
          <LargeSpinner className="flex w-80 justify-center" />
        )}
      </div>
    </div>
  );
};

export default Rivalries;
