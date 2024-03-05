import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>HexFleet - 404</title>
      </Head>
      <div className="mx-6 mt-8 flex-1">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-4 text-xl">
          Sorry, no page was found at this address.
        </p>
      </div>
    </>
  );
}
