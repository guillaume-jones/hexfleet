import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpLeftIcon,
  ArrowUpRightIcon,
  ArrowsUpDownIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid';

import { pressureToConquer } from 'functions/src/game-logic/GameConstants';

export const touchControls = [
  {
    Icon: ChevronUpIcon,
    actionName: 'Tap',
    result: 'Select a tile, use controls below',
  },
  {
    Icon: ChevronDoubleUpIcon,
    actionName: 'Double tap',
    result: `Add ${pressureToConquer} influence to a tile`,
  },
  {
    Icon: ArrowDownIcon,
    actionName: 'Long press',
    result: 'Reset a tile',
  },
];

export const mouseControls = [
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
    result: 'Leave one of your tiles',
  },
  {
    Icon: ChevronDoubleDownIcon,
    actionName: 'Spacebar',
    result: 'Send or re-send your turn',
  },
];
