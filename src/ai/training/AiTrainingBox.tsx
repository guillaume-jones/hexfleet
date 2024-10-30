import { useEffect, useState } from 'react';

import { useAiTraining } from './useAiTraining';

import Button from 'src/components/interactive/Button';
import Input from 'src/components/interactive/Input';
import Range from 'src/components/interactive/Range';
import LoadingSpinner from 'src/components/other/LoadingSpinner';

export function AiTrainingBox() {
  const [isTraining, setIsTraining] = useState(false);

  const {
    ais,
    round,
    scoreboard,
    options,
    setOptions,
    runTrainingRound,
    clearAis,
  } = useAiTraining();

  useEffect(() => {
    if (!isTraining) return;

    const asyncRunTrainingRound = async () => {
      // Let state update, make UI responsive
      await new Promise((r) => setTimeout(r, 2000));
      runTrainingRound();
    };

    void asyncRunTrainingRound();
  }, [isTraining, runTrainingRound]);

  return (
    <div className="flex flex-col gap-8 sm:flex-row">
      <div className="flex max-w-96 flex-col gap-4">
        <h2 className="text-xl font-bold">Top AI:</h2>
        <p className="flex text-wrap break-all text-xs">
          {JSON.stringify(ais[0], undefined, ' ')}
        </p>
        <div className="flex w-52 flex-row justify-between">
          <h2 className="text-xl font-bold">Scoreboard</h2>
          <h3 className="text-lg font-semibold">Round: {round}</h3>
        </div>
        {scoreboard.map(({ id, score }, i) => (
          <div key={id + i} className="flex w-52 flex-row justify-between">
            <p>
              {i + 1}. {id.slice(0, 8)}
            </p>
            <p>{score}</p>
          </div>
        ))}
      </div>
      <div className="flex w-80 flex-col items-stretch gap-4">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-bold">Options</h2>
          <Button light onClick={clearAis}>
            Reset AI
          </Button>
        </div>
        <Range
          showValue
          min={7}
          max={15}
          step={2}
          startText="Board Size"
          containerClassname="justify-between"
          value={options.boardSize}
          setValue={(v) =>
            setOptions((prev) => ({
              ...prev,
              boardSize: typeof v === 'number' ? v : v(prev.boardSize),
            }))
          }
        />
        <Range
          showValue
          min={1}
          max={20}
          step={2}
          startText="Matches per matchup"
          containerClassname="justify-between"
          value={options.matchesPerMatchup}
          setValue={(v) =>
            setOptions((prev) => ({
              ...prev,
              matchesPerMatchup:
                typeof v === 'number' ? v : v(prev.matchesPerMatchup),
            }))
          }
        />
        <Range
          showValue
          min={10}
          max={50}
          step={5}
          startText="Max turns per game"
          containerClassname="justify-between"
          value={options.maxTurnsPerGame}
          setValue={(v) =>
            setOptions((prev) => ({
              ...prev,
              maxTurnsPerGame:
                typeof v === 'number' ? v : v(prev.maxTurnsPerGame),
            }))
          }
        />
        <div className="flex flex-row items-center justify-between">
          <p className="flex-1">Fraction to keep:</p>
          <Input
            className="w-24"
            value={String(options.fractionToKeep)}
            setValue={(v) =>
              setOptions((prev) => ({
                ...prev,
                fractionToKeep: Number(v),
              }))
            }
            inputProps={{
              type: 'number',
              step: 0.1,
              min: 0.1,
              max: 0.3,
            }}
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <p className="flex-1">Evolution rate:</p>
          <Input
            className="w-24"
            value={String(options.evolutionRate)}
            setValue={(v) =>
              setOptions((prev) => ({
                ...prev,
                evolutionRate: Number(v),
              }))
            }
            inputProps={{
              type: 'number',
              step: 0.01,
              min: 0.01,
              max: 0.2,
            }}
          />
        </div>

        <div className="flex flex-row items-center justify-between">
          <Button onClick={() => setIsTraining((prev) => !prev)}>
            {isTraining ? 'Stop Training' : 'Start Training'}
          </Button>
          {isTraining && <LoadingSpinner className="relative" />}
        </div>
      </div>
    </div>
  );
}
