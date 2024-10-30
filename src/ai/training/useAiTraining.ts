import { range } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import { AIConstants, adjustableConstants } from './ai-constants';
import {
  SimulationOptions,
  defaultSimulationOptions,
  simulateAiEvolution,
} from './ai-evolution';

const aiStorageKey = 'ai-constants';
const roundStorageKey = 'ai-round';

const generateInitialAis = (count: number) =>
  range(count).map((i) => ({
    ...adjustableConstants,
    myId: `AI${i}`,
    maxSimulations: 1000,
  }));

const getInitialScoreboard = (ais: AIConstants[]) =>
  ais.map((ai) => ({
    id: ai.myId,
    score: 0,
  }));

export const useAiTraining = () => {
  const [options, setOptions] = useState<SimulationOptions>(
    defaultSimulationOptions,
  );
  const [ais, setAis] = useState<AIConstants[]>([]);
  const [scoreboard, setScoreboard] = useState<{ id: string; score: number }[]>(
    [],
  );
  const [round, setRound] = useState(0);

  // Fetches AIs from local storage
  useEffect(() => {
    const storedRounds = localStorage.getItem(roundStorageKey);
    if (storedRounds) {
      setRound(Number(storedRounds));
    }

    const storedAiString = localStorage.getItem(aiStorageKey);
    if (!storedAiString) {
      const initialAis = generateInitialAis(
        defaultSimulationOptions.populationSize,
      );
      setAis(initialAis);
      setScoreboard(getInitialScoreboard(initialAis));
      return;
    }

    const storedAis = JSON.parse(storedAiString) as AIConstants[];
    const updatedAis = Array.from(
      { length: defaultSimulationOptions.populationSize },
      (_, i) => {
        if (i < storedAis.length) {
          return storedAis[i];
        }
        return {
          ...storedAis[0],
          myId: `AI${i}`,
        };
      },
    );

    setAis(updatedAis);
    setScoreboard(getInitialScoreboard(updatedAis));
  }, []);

  const runTrainingRound = useCallback(() => {
    const { scores, newAis } = simulateAiEvolution(ais, options);

    setAis(newAis);
    localStorage.setItem(aiStorageKey, JSON.stringify(newAis));

    setScoreboard(scores.map(({ ai, score }) => ({ id: ai.myId, score })));
    setRound((r) => {
      localStorage.setItem(roundStorageKey, String(r + 1));
      return r + 1;
    });
  }, [ais, options]);

  const clearAis = useCallback(() => {
    localStorage.removeItem(aiStorageKey);

    const initialAis = generateInitialAis(options.populationSize);
    setAis(initialAis);
    setScoreboard(getInitialScoreboard(initialAis));
  }, [options.populationSize]);

  return {
    ais,
    scoreboard,
    options,
    round,
    setOptions,
    runTrainingRound,
    clearAis,
  };
};
