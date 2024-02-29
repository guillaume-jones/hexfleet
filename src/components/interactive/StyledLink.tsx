import Link from 'next/link';

function StyledLink({
  children,
  href,
  onClick,
  className,
  light,
  danger,
  newTab,
}: {
  children?: React.ReactNode | string;
  href?: string;
  onClick?: () => void;
  className?: string;
  light?: boolean;
  danger?: boolean;
  newTab?: boolean;
}) {
  return (
    <>
      {href ? (
        <Link
          className={`transition-all 
        ${
          danger
            ? light
              ? 'text-red-400 hover:text-red-500 active:text-red-600'
              : 'text-red-600 hover:text-red-500 active:text-red-700'
            : light
            ? 'text-emerald-300 hover:text-opacity-70 active:text-opacity-50'
            : 'text-emerald-600 hover:text-emerald-500 active:text-emerald-800'
        } 
        ${className ?? ''}`}
          href={href}
          target={newTab ? '_blank' : undefined}
          rel="noopener noreferrer">
          {children}
        </Link>
      ) : (
        <button
          className={`transition-all 
          ${
            danger
              ? light
                ? 'text-red-400 hover:text-red-500 active:text-red-600'
                : 'text-red-600 hover:text-red-500 active:text-red-700'
              : light
              ? 'text-emerald-300 hover:text-opacity-70 active:text-opacity-50'
              : 'text-emerald-600 hover:text-emerald-500 active:text-emerald-800'
          } 
          ${className ?? ''}`}
          onClick={onClick}>
          {children}
        </button>
      )}
    </>
  );
}

export default StyledLink;
