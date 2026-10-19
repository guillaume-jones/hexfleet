import Head from 'next/head';
import Image from 'next/image';

import GameCreation from 'src/landing/GameCreation';
import GameJoining from 'src/landing/GameJoining';
import HomepageCampaignBox from 'src/landing/HomepageCampaignBox';
import RejoinButton from 'src/landing/RejoinButton';

export default function Landing() {
  return (
    <>
      <Head>
        <title>HexFleet - Hexagonal tile conquest</title>
      </Head>
      <div className="flex flex-1 flex-col items-center">
        <div className="relative mb-6 mt-10 transition-all duration-500 hover:scale-110">
          <Image
            priority={true}
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/logo/android-chrome-192x192.webp`}
            width={192}
            height={192}
            alt="logo"
            className="absolute -left-5 -top-6 h-24 w-24"
          />
          <h1 className="relative z-10 font-orbitron text-4xl font-bold md:self-start">
            HexFleet
          </h1>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-10 p-10 sm:flex-row sm:items-start">
          <div className="flex w-60 flex-col items-center gap-4">
            <h2 className="text-2xl font-semibold">Singleplayer</h2>

            <HomepageCampaignBox />
          </div>

          <div className="h-0.5 w-40 rounded-md border border-b-white sm:h-40 sm:w-0.5" />

          <div className="flex w-52 flex-col items-center gap-6">
            <h2 className="text-2xl font-semibold">Multiplayer</h2>
            <GameCreation />
            <div className="flex flex-row items-start">
              <div className="h-4 w-8 border-b border-b-white" />
              <p className="mx-2"> or </p>
              <div className="h-4 w-8 border-b border-b-white" />
            </div>
            <GameJoining />
            <RejoinButton />
          </div>
        </div>
      </div>
    </>
  );
}
