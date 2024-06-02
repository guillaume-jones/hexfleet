import Head from 'next/head';

import Button from 'src/components/interactive/Button';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>HexFleet - 404</title>
      </Head>
      <div className="m-8 flex flex-1 flex-col gap-6">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl">Sorry! No page was found at this address.</p>
        <Button href="/" className="self-start">
          Return to homepage
        </Button>
      </div>
    </>
  );
}
