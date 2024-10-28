import Head from 'next/head';

import { AiVsAiProvider } from 'src/ai/training/AIvAIContext';
import GameDisplay from 'src/game/GameDisplay';

export default function AiTraining() {
  return (
    <>
      <Head>
        <title>HexFleet - AI Sandbox</title>
      </Head>
      <AiVsAiProvider>
        <GameDisplay />
      </AiVsAiProvider>
    </>
  );
}
