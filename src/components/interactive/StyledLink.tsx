import Link from 'next/link';

function StyledLink({
  children,
  href,
  onClick,
  className,
  light,
  danger,
  newTab,
  active,
}: {
  children?: React.ReactNode | string;
  href?: string;
  onClick?: () => void;
  className?: string;
  light?: boolean;
  danger?: boolean;
  newTab?: boolean;
  active?: boolean;
}) {
  return (
    <>
      {href ? (
        <Link
          className={`transition-all 
        ${
          danger
            ? light
              ? active
                ? 'text-red-600'
                : 'text-red-400 hover:text-red-500 active:text-red-600'
              : active
              ? 'text-red-700'
              : 'text-red-600 hover:text-red-500 active:text-red-700'
            : light
            ? active
              ? 'text-violet-600'
              : 'text-violet-400 hover:text-opacity-70 active:text-opacity-50'
            : active
            ? 'text-violet-800'
            : 'text-violet-600 hover:text-violet-500 active:text-violet-800'
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
                ? active
                  ? ''
                  : 'text-red-400 hover:text-red-500 active:text-red-600'
                : active
                ? 'text-red-700'
                : 'text-red-600 hover:text-red-500 active:text-red-700'
              : light
              ? active
                ? 'text-violet-600'
                : 'text-violet-400 hover:text-opacity-70 active:text-opacity-50'
              : active
              ? 'text-violet-900'
              : 'text-violet-700 hover:text-violet-600 active:text-violet-900'
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
