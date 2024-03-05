function LoginTypeBox({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div
        className={`
        flex w-72 flex-col items-center gap-4 rounded-2xl bg-zinc-50 p-4 text-violet-800 shadow-md ${
          className ?? ''
        }`}>
        <h2 className="text-xl font-bold transition-all">{title}</h2>
        {children}
      </div>
    </>
  );
}

export default LoginTypeBox;
