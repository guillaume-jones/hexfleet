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
        className="m-3 flex max-w-2xl flex-col gap-3 overflow-scroll sm:overflow-auto"
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
          During each turn, you can <b>spend influence</b>, competing with
          others to conquer, protect or disable tiles:
        </p>
        <ul className="grid list-disc gap-1 pl-6">
          <li>
            Spending {pressureToConquer} more influence than any other player
            will <b>conquer</b> a tile
          </li>
          <li>
            Spending {pressureToDisable} more influence than the tile owner will{' '}
            <b>disable</b> their tile
          </li>
          <li>
            Spending is <b>2× more expensive</b> if a tile does not touch your
            tiles
          </li>
          <li>
            Homeworlds are <b>{homeworldDistanceModifier}× more expensive</b> to
            influence
          </li>
          <li>
            You can apply <b>up to 8</b> influence on a tile
          </li>
          <li>
            You <b>cannot reach</b> a tile more than {maxInfluenceReach} tiles
            away from your tiles
          </li>
          <li>Influence can be spent on your own tiles, to protect them</li>
        </ul>
        <p>
          Your influence to spend is determined by the{' '}
          <b>number of borders you have with unconquered tiles</b>. You can
          leave a tile you control to create new borders and potentially
          generate more influence.
        </p>
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
      </Modal>
    </div>
  );
};

export default HelpBox;
