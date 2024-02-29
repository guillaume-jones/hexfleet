function AlignedBox({
  children,
  className,
  light,
}: {
  children?: React.ReactNode[];
  className?: string;
  light?: boolean;
}) {
  return (
    <div
      className={`flex max-w-lg flex-col gap-2 rounded-xl px-4 py-3 shadow-md 
      ${
        light
          ? 'bg-stone-50'
          : 'bg-gradient-to-br from-emerald-800 to-emerald-700 text-stone-50'
      }
      ${className ?? ''}`}>
      {children?.map((row, index) => {
        return (
          <div
            key={index}
            className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
            {row}
          </div>
        );
      })}
    </div>
  );
}

export default AlignedBox;
