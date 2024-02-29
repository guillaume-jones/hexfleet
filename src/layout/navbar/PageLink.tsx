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
        isCurrentPath ? 'text-emerald-300' : 'text-stone-50'
      } font-semibold transition-colors duration-200 hover:text-emerald-300 active:text-emerald-500 ${
        className ?? ''
      }`}
      href={href}
      onClick={onClick}
      rel="canonical">
      {typeof children === 'string' && isCurrentPath ? (
        <h1>{children}</h1>
      ) : (
        children
      )}
    </Link>
  );
}

export default PageLink;
