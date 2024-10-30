import Head from 'next/head';

import { AiTrainingBox } from 'src/ai/training/AiTrainingBox';

export default function AiTraining() {
  return (
    <>
      <Head>
        <title>HexFleet - AI Sandbox</title>
      </Head>
      <div className="mx-12 mt-8 flex max-w-4xl flex-1 flex-col gap-4 pb-10">
        <h1 className={'text-3xl font-semibold text-zinc-50'}>AI Training</h1>
        <AiTrainingBox />
      </div>
    </>
  );
}
