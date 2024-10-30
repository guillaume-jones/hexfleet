import { getAiNextTurn } from '../next-ai-turn';
import { random, range } from 'lodash';

import { AIConstants, adjustableConstants } from './ai-constants';
import { Tile } from 'functions/src/document-types/Games';
import { updateBoardTurn } from 'functions/src/game-logic/updateBoardTurn';

import { createAIGame } from 'src/game/create-game/createGame';

export type SimulationOptions = {
  boardSize: number;
  matchesPerMatchup: number;
  maxTurnsPerGame: number;
  fractionToKeep: number;
  evolutionRate: number;
  populationSize: number;
};

export const defaultSimulationOptions: SimulationOptions = {
  boardSize: 9,
  matchesPerMatchup: 5,
  maxTurnsPerGame: 15,
  fractionToKeep: 0.2,
  evolutionRate: 0.05,
  populationSize: 10,
};

const areBoardStatesEqual = (a: Tile[], b: Tile[]) => {
  for (let i = 0; i < a.length; i++) {
    if (a[i].playerId !== b[i]?.playerId) return false;
  }

  return true;
};

const simulateGame = (
  ais: AIConstants[],
  { boardSize, maxTurnsPerGame }: SimulationOptions,
) => {
  const players = ais.map((ai) => ai.myId);
  const drawValues = ais.map(() => 1 / ais.length);
  const game = createAIGame({ boardSize }, players);

  for (let i = 0; i < maxTurnsPerGame; i++) {
    const nextTurns = ais.map((ai) => getAiNextTurn(game, ai));
    const { newBoardState, newPlayers, winner } = updateBoardTurn({
      game,
      nextTurns,
      players,
    });

    // Early return for winner
    if (winner) {
      return ais.map((ai) => (ai.myId === winner ? 1 : 0));
    }
    // Early return for draw
    if (areBoardStatesEqual(game.boardState, newBoardState)) {
      return drawValues;
    }

    game.boardState = newBoardState;
    game.players = newPlayers;
  }

  return drawValues;
};

const simulateRoundRobin = (ais: AIConstants[], options: SimulationOptions) => {
  const scores = ais.map((ai) => ({ ai, score: 0 }));

  for (let i = 0; i < ais.length - 1; i++) {
    console.info(`Simulating AI ${i + 1}/${ais.length}`);
    for (let j = i + 1; j < ais.length; j++) {
      console.info(`against ${j + 1}/${ais.length}`);
      const players = [ais[i], ais[j]];

      for (let match = 0; match < options.matchesPerMatchup; match++) {
        const result = simulateGame(players, options);
        scores[i].score += result[0];
        scores[j].score += result[1];
      }
    }
  }

  return scores;
};

const evolveAiValues = (
  ai: AIConstants,
  { evolutionRate }: SimulationOptions,
) => {
  const newAi = { ...ai };

  for (const rawKey in adjustableConstants) {
    const key = rawKey as keyof typeof adjustableConstants;
    const value = ai[key];

    newAi[key] = (
      typeof value === 'number'
        ? value * random(1 - evolutionRate, 1 + evolutionRate, true)
        : value.map(
            (v) => v * random(1 - evolutionRate, 1 + evolutionRate, true),
          )
    ) as number & number[];
  }

  newAi.myId = `AI${Math.random()}`;

  return newAi;
};

export const simulateAiEvolution = (
  ais: AIConstants[],
  options: SimulationOptions,
) => {
  const sortedScores = simulateRoundRobin(ais, options).sort(
    (a, b) => b.score - a.score,
  );

  const keptAis = sortedScores
    .slice(0, options.fractionToKeep * ais.length)
    .map(({ ai }) => ai);

  const newAis = range(ais.length - keptAis.length).map((i) =>
    evolveAiValues(keptAis[i % keptAis.length], options),
  );

  return { scores: sortedScores, newAis: [...keptAis, ...newAis] };
};
