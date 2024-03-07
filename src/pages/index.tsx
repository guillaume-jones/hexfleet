import Head from 'next/head';

export default function Landing() {
  document.addEventListener('scroll', () => {
    console.log('scroll event fired!');
  });

  return (
    <>
      <Head>
        <title>HexFleet - Hexagonal tile conquest</title>
      </Head>
      <div className="flex w-full flex-1 flex-col items-center">
        <h1 className="text-center">HexFleet</h1>
      </div>
    </>
  );
}
