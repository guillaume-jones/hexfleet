import { useContext } from 'react';

import { GameContext } from './GameContext';

const GameCode = () => {
  const { shortId } = useContext(GameContext);

  if (!shortId) return null;

  return (
    <div className="flex w-48 flex-col rounded-xl bg-violet-900 px-4 py-3 text-center">
      <h2 className="text-2xl font-semibold">Game Code</h2>
      <p className="text-xl font-semibold">{shortId}</p>
    </div>
  );
};

export default GameCode;
