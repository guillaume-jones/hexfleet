import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Dispatch, SetStateAction } from 'react';

import { PossibleOrderField } from './leaderboardTypes';

import StyledLink from 'src/components/interactive/StyledLink';

const SortableTableHeader = ({
  orderField,
  setOrderField,
  targetField,
  text,
}: {
  orderField: string;
  setOrderField: Dispatch<SetStateAction<PossibleOrderField>>;
  targetField: PossibleOrderField;
  text: string;
}) => {
  return (
    <StyledLink
      light
      active={orderField === targetField}
      className={`flex w-16 items-center justify-center ${
        orderField === targetField ? 'font-semibold' : ''
      }`}
      onClick={() => setOrderField(targetField)}>
      {text}
      <ChevronDownIcon
        className={`${
          orderField === targetField ? 'opacity-100' : 'opacity-0'
        } h-5 w-5 rounded-full  stroke-violet-600 stroke-1 transition-opacity`}
      />
    </StyledLink>
  );
};

export default SortableTableHeader;
