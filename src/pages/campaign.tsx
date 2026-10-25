import { signInAnonymously } from 'firebase/auth';
import Head from 'next/head';
import { useEffect } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import CampaignMapsSection from 'src/campaign/CampaignMapsSection';
import { auth } from 'src/firebase/firebaseApp';

export default function Games() {
  const [user, userLoading] = useIdToken(auth);

  useEffect(() => {
    if (!userLoading && !user) void signInAnonymously(auth);
  }, [user, userLoading]);

  return (
    <>
      <Head>
        <title>HexFleet - Campaign</title>
      </Head>
      <div className="flex flex-1 flex-col items-center gap-4 p-8 pt-4">
        <h2 className={'text-2xl font-semibold'}>Campaign</h2>
        <p>
          Face off against the AI in an increasingly unwinnable series of
          matches across the galaxy.
        </p>
        <CampaignMapsSection />
      </div>
    </>
  );
}
