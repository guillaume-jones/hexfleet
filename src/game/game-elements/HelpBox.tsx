import { useState } from 'react';
import { HelpCircle } from 'react-feather';

import { mouseControls, touchControls } from './Controls';
import {
  homeworldDistanceModifier,
  maxInfluenceReach,
  pressureToConquer,
  pressureToDisable,
} from 'functions/src/game-logic/GameConstants';

import Modal from 'src/components/containers/Modal';
import Button from 'src/components/interactive/Button';
import useIsTouchscreen from 'src/utilityHooks/useIsTouchscreen';

type HelpBoxProps = {
  className?: string;
};

const HelpBox = ({ className }: HelpBoxProps) => {
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const isTouchScreen = useIsTouchscreen();

  return (
    <div className={className}>
      <Button onClick={() => setHelpModalOpen(true)}>
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">Help</p>
          <HelpCircle className="h-6 w-6" />
        </div>
      </Button>
      <Modal
        className="m-3 flex max-w-3xl flex-col gap-3 overflow-scroll sm:overflow-auto"
        open={helpModalOpen}
        setOpen={setHelpModalOpen}>
        <h3 className="text-xl font-semibold">Game controls</h3>
        {(isTouchScreen ? touchControls : mouseControls).map(
          ({ Icon, actionName, result }) => (
            <div key={actionName} className="flex items-center gap-2">
              <Icon className="h-6 w-6" />
              <p className="text-nowrap font-semibold">{actionName}:</p>
              <p className="flex-1">{result}</p>
            </div>
          ),
        )}
        <h3 className="text-xl font-semibold">Game rules</h3>
        <p>
          In HexFleet, the goal is to <b>conquer</b> you enemies&apos;
          homeworlds, or force them to <b>resign</b> by dominating the board.
          The game is played in turns, during which all players spend influence
          to conquer, disable or protect tiles.
        </p>
        <ul className="grid list-disc gap-1 pl-6">
          <li>
            Spending <b>{pressureToConquer}</b> more influence than any other
            player will <b>conquer</b> a tile
          </li>
          <li>
            Spending <b>{pressureToDisable}</b> more influence than the tile
            owner will <b>disable</b> their tile
          </li>
          <li>
            You can apply <b>up to 8</b> influence on a tile
          </li>
          <li>
            Tiles &gt;{maxInfluenceReach} tiles away <b>cannot be influenced</b>
          </li>
          <li>
            Tiles you do not touch are <b>2× more expensive</b> to influence
          </li>
          <li>
            Homeworlds are <b>{homeworldDistanceModifier}× more expensive</b> to
            influence
          </li>
        </ul>
        <p>
          Your available influence is determined by the{' '}
          <b>number of borders you have with empty tiles</b>.
        </p>
        <ul className="grid list-disc gap-1 pl-6">
          <li>
            Each of your tiles costs <b>1 influence to maintain</b>
          </li>
          <li>Disabled tiles generate no influence</li>
          <li>You can leave a tile you control to create new borders</li>
        </ul>
      </Modal>
    </div>
  );
};

export default HelpBox;
