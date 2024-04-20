import {
  ArrowUpIcon,
  ArrowUpLeftIcon,
  ArrowUpRightIcon,
  ArrowsUpDownIcon,
  ChevronDoubleDownIcon,
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
        className="m-3 flex max-w-2xl flex-col gap-3"
        open={helpModalOpen}
        setOpen={setHelpModalOpen}>
        <h3 className="text-xl font-semibold">Game rules</h3>
        <p>
          The goal in HexFleet is to advance and conquer board tiles. You win if
          all other players have <b>resigned</b> or <b>lost their homeworlds</b>
          . The game is played in turns, with all players submitting their turns{' '}
          <b>at the same time</b>.
        </p>
        <p>
          During each turn, you can spend influence on tiles, competing with
          others to conquer, protect or disable them:
        </p>
        <ul className="grid list-disc gap-1 pl-6">
          <li>
            Spending {pressureToConquer} more influence than any other player
            will <b>conquer</b> a tile
          </li>
          <li>
            Spending {pressureToDisable} more influence than any other player
            will <b>disable</b> a tile
          </li>
          <li>Spending further away from your tiles is more expensive</li>
          <li>
            You cannot reach a tile more than {maxInfluenceReach} tiles away
            from your tiles
          </li>
          <li>Influence can be spent on your own tiles, to protect them</li>
        </ul>
        <p>
          Your influence to spend is determined by the{' '}
          <b>number of borders you have with unconquered tiles</b>. You can
          spend {pressureToClear} influence to clear a conquered tile,
          potentially creating new borders to generate more influence.
        </p>
        <h3 className="text-xl font-semibold">Game controls</h3>
        {[
          {
            Icon: ArrowsUpDownIcon,
            actionName: 'Scroll',
            result: 'Change influence applied to a tile',
          },
          {
            Icon: ArrowUpLeftIcon,
            actionName: 'Left Click',
            result: `Add ${pressureToConquer} influence on a tile`,
          },
          {
            Icon: ArrowUpRightIcon,
            actionName: 'Right Click',
            result: `Remove ${pressureToConquer} influence on a tile`,
          },
          {
            Icon: ArrowUpIcon,
            actionName: 'Middle Click',
            result: 'Clear one of your tiles',
          },
          {
            Icon: ChevronDoubleDownIcon,
            actionName: 'Spacebar',
            result: 'Send or re-send your turn',
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
