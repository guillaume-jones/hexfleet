import React from 'react';

import HexagonalBoard from './HexagonalBoard';
import ScoreBox from './ScoreBox';

const GameDisplay = () => {
  return (
    <div className="flex max-w-5xl items-center gap-6 lg:items-end">
      <div className="lg:absolute lg:left-4 lg:top-4">
        <ScoreBox />
      </div>
      <HexagonalBoard />
    </div>
  );
};

export default GameDisplay;
