import { Dispatch, SetStateAction } from 'react';

import SortableTableHeader from './SortableTableHeader';
import { LeaderboardType, PossibleOrderField } from './leaderboardTypes';

const TableHeaderForType = ({
  type,
  orderField,
  setOrderField,
  className,
  hideTitle,
}: {
  type: LeaderboardType;
  orderField: PossibleOrderField;
  setOrderField: Dispatch<SetStateAction<PossibleOrderField>>;
  className?: string;
  hideTitle?: boolean;
}) => {
  return (
    <div className={className}>
      {!hideTitle && <h2>{type}</h2>}
      <div className="flex text-lg font-medium">
        <SortableTableHeader
          orderField={orderField}
          setOrderField={setOrderField}
          targetField={('elo' + type) as 'elo1v1'}
          text="Elo"
        />
        <SortableTableHeader
          orderField={orderField}
          setOrderField={setOrderField}
          targetField={('wins' + type) as 'wins1v1'}
          text="Wins"
        />
        <SortableTableHeader
          orderField={orderField}
          setOrderField={setOrderField}
          targetField={('wr' + type) as 'wr1v1'}
          text="WR"
        />
      </div>
    </div>
  );
};

export default TableHeaderForType;
