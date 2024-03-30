import type { AppProps } from 'next/app';
import Head from 'next/head';

import Footer from 'src/layout/footer/Footer';
import Navbar from 'src/layout/navbar/Navbar';
import 'src/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="fixed h-screen w-screen overflow-hidden bg-zinc-950">
        <Navbar />
        <div className="fixed bottom-0 top-14 -z-10 flex w-full flex-col overflow-x-hidden ">
          <Component {...pageProps} />
          <Footer />
        </div>
      </div>
    </>
  );
}
