import Head from 'next/head';
import Image from 'next/image';

import GameCreation from 'src/landing/GameCreation';
import GameJoining from 'src/landing/GameJoining';

export default function Landing() {
  return (
    <>
      <Head>
        <title>HexFleet - Hexagonal tile conquest</title>
      </Head>
      <div className="flex flex-1 flex-col items-center">
        <div className="relative my-10 transition-all duration-500 hover:scale-110">
          <Image
            src="/logo/android-chrome-192x192.webp"
            width={192}
            height={192}
            alt="logo"
            className="absolute -left-5 -top-6 h-24 w-24"
          />
          <h1 className="relative z-10 font-orbitron text-4xl font-bold md:self-start">
            HexFleet
          </h1>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-8 p-10 sm:flex-row sm:items-start">
          <GameCreation />
          <div className="flex flex-row items-start sm:hidden">
            <div className="h-4 w-14 border-b border-b-white" />
            <p className="mx-2"> or </p>
            <div className="h-4 w-14 border-b border-b-white" />
          </div>
          <div className="hidden flex-col items-start sm:flex">
            <div className="h-14 w-2 border-r border-r-white" />
            <p className="mb-2 mt-1"> or </p>
            <div className="h-14 w-2 border-r border-r-white" />
          </div>
          <GameJoining />
        </div>
      </div>
    </>
  );
}
