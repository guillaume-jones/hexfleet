import {
  ArrowUpLeftIcon,
  ArrowUpRightIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/20/solid';
import { useState } from 'react';
import { HelpCircle } from 'react-feather';

import {
  maxInfluenceReach,
  pressureToClear,
  pressureToConquer,
  pressureToDisable,
} from 'functions/src/game-logic/GameConstants';

import Modal from 'src/components/containers/Modal';
import Button from 'src/components/interactive/Button';

type HelpBoxProps = {
  className?: string;
};

const HelpBox = ({ className }: HelpBoxProps) => {
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  return (
    <div className={className}>
      <Button onClick={() => setHelpModalOpen(true)}>
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">Help</p>
          <HelpCircle className="h-6 w-6" />
        </div>
      </Button>
      <Modal
        className="m-3 flex max-w-xl flex-col gap-3"
        open={helpModalOpen}
        setOpen={setHelpModalOpen}>
        <h3 className="text-xl font-semibold">Game rules</h3>
        <p>
          The goal in HexFleet is to advance and conquer board tiles. A player
          wins when all other players have resigned or lost their homeworlds.
          The game is played in turns, and all players submit their turns at the
          same time.
        </p>
        <p>
          During each turn, you can spend influence on tiles, competing with
          others to conquer or disable them:
        </p>
        <ul className="grid list-disc gap-1 pl-6">
          <li>
            Spending {pressureToConquer} more influence than any other player
            will conquer a tile
          </li>
          <li>
            Spending {pressureToDisable} more influence than any other player
            will disable a tile
          </li>
          <li>Spending is more expensive farther from your tiles </li>
          <li>
            You cannot reach a tile more than {maxInfluenceReach} tiles away
            from your tiles
          </li>
          <li>Influence can be spent on your own tiles, to protect them</li>
        </ul>
        <p>
          Your influence to spend is determined by the number of borders you
          have with unconquered tiles. You can spend {pressureToClear} influence
          to clear one of your own tiles, potentially creating new borders to
          generate more influence.
        </p>
        <h3 className="text-xl font-semibold">Game controls</h3>
        {[
          {
            Icon: ArrowsUpDownIcon,
            actionName: 'Scroll',
            result: 'Increase or decrease influence on a tile',
          },
          {
            Icon: ArrowUpLeftIcon,
            actionName: 'Left Click',
            result: `Add ${pressureToConquer} influence on a tile`,
          },
          {
            Icon: ArrowUpRightIcon,
            actionName: 'Right Click',
            result: `Clear your tile / Remove ${pressureToConquer} influence on a tile`,
          },
        ].map(({ Icon, actionName, result }) => (
          <div key={actionName} className="flex items-center gap-3">
            <Icon className="h-8 w-8" />
            <p className="text-nowrap font-semibold">{actionName}:</p>
            <p className="flex-1">{result}</p>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default HelpBox;
