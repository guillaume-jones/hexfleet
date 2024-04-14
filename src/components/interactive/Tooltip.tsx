function Tooltip({
  children,
  className,
}: {
  children: React.ReactElement | string;
  className?: string;
}) {
  return (
    <div
      className={`invisible absolute left-0 top-full z-20 mt-1 flex flex-col items-center opacity-0  transition-all duration-300 group-hover:visible group-hover:opacity-100  ${
        className ?? ''
      }`}>
      <div className="ml-1 h-0 w-0 rotate-45 bg-zinc-50 transition-all duration-300 group-hover:ml-0 group-hover:h-3 group-hover:w-3" />
      <div className="break -mt-2 rounded-md bg-zinc-50 p-2 text-center text-sm font-semibold shadow-md">
        {typeof children === 'string' ? <p>{children}</p> : children}
      </div>
    </div>
  );
}

export default Tooltip;
