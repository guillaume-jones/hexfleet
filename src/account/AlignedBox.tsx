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
      className={`flex flex-col gap-2 rounded-xl px-4 py-3 shadow-md 
      ${
        light
          ? 'bg-zinc-50'
          : 'bg-gradient-to-br from-zinc-900 to-zinc-800 text-zinc-50'
      }
      ${className}`}>
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
