import sum from 'lodash/sum';

const PieChart = ({
  data,
  dataColors,
  className,
}: {
  data: number[];
  dataColors: string[];
  className?: string;
}) => {
  const total = sum(data);

  return (
    <div className={className}>
      {total > 0 &&
        data.map((d, i) => {
          const percentage = d / total;
          const percentageCumulative = sum(data.slice(0, i)) / total;

          const strokeDashArray = `0 ${percentageCumulative * Math.PI} ${
            percentage * Math.PI
          } ${Math.PI}`;

          return (
            <svg
              transform={'rotate(-90)'}
              key={i}
              className={'absolute bottom-0 left-0 right-0 top-0'}
              viewBox="0 0 2 2">
              <circle
                r={0.5}
                cx={1}
                cy={1}
                fill={'transparent'}
                className={dataColors[i]}
                strokeWidth={1}
                strokeDasharray={strokeDashArray}
              />
            </svg>
          );
        })}
    </div>
  );
};

export default PieChart;
