import Head from 'next/head';

import CampaignMapsSection from 'src/campaign/CampaignMapsSection';
import useRedirectIfNotAuth from 'src/utilityHooks/useRedirectIfNotAuth';

export default function Games() {
  useRedirectIfNotAuth();

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
