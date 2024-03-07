import Link from 'next/link';

function PageLink({
  children,
  href,
  currentPath,
  className,
  onClick,
}: {
  children: React.ReactNode | string;
  href: string;
  currentPath?: string;
  className?: string;
  onClick?: () => void;
}) {
  const isCurrentPath = currentPath === href;
  return (
    <Link
      className={`${
        isCurrentPath
          ? 'text-violet-700'
          : 'text-zinc-50 hover:text-violet-300 active:text-violet-500'
      } font-semibold transition-colors duration-200  ${className ?? ''}`}
      href={href}
      onClick={onClick}
      rel="canonical">
      {typeof children === 'string' ? (
        <h1 className="text-nowrap">{children}</h1>
      ) : (
        children
      )}
    </Link>
  );
}

export default PageLink;
