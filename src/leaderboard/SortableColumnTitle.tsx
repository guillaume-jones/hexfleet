import { Dispatch, SetStateAction } from 'react';

import { PossibleOrderField } from './leaderboardTypes';

import StyledLink from 'src/components/interactive/StyledLink';

const SortableColumnTitle = ({
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
      className={`flex w-14 items-center justify-center  border-b-2  transition-all ${
        orderField === targetField ? 'border-violet-600' : 'border-transparent'
      }`}
      onClick={() => setOrderField(targetField)}>
      {text}
    </StyledLink>
  );
};

export default SortableColumnTitle;
