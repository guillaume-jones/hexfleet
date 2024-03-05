import LoadingSpinner from '../other/LoadingSpinner';
import Link from 'next/link';

const doNothing = () => undefined;

function Button({
  children,
  href,
  onClick,
  className,
  light,
  disabled,
  buttonProps,
  openInNewTab,
  fixedActive,
  loading,
  danger,
  fontClassName,
}: {
  children?: React.ReactNode | string;
  href?: string;
  onClick?: () => void;
  className?: string;
  light?: boolean;
  disabled?: boolean;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  openInNewTab?: boolean;
  fixedActive?: boolean;
  loading?: boolean;
  danger?: boolean;
  fontClassName?: string;
}) {
  const styling = `rounded-xl px-4 py-2 text-center transition-all flex items-center justify-center relative
  ${
    light
      ? 'text-violet-800 disabled:text-zinc-600'
      : 'text-white disabled:text-zinc-300'
  }
  ${fontClassName ? fontClassName : light ? 'font-semibold' : 'font-medium'}
  ${
    fixedActive
      ? light
        ? 'bg-violet-400'
        : danger
        ? 'bg-red-500'
        : 'bg-violet-500'
      : light
      ? 'bg-zinc-50 disabled:bg-zinc-300 sm:hover:bg-violet-200 sm:active:bg-violet-300 sm:disabled:bg-zinc-300'
      : danger
      ? 'bg-red-600 disabled:bg-zinc-400 sm:hover:bg-red-500 sm:active:bg-red-400 sm:disabled:bg-zinc-400'
      : 'bg-violet-700 disabled:bg-zinc-500 sm:hover:bg-violet-600 sm:active:bg-violet-500 sm:disabled:bg-zinc-500'
  }
  ${fixedActive ? 'cursor-default' : ''}
  ${className ?? ''}`;

  return (
    <>
      {href ? (
        <Link
          className={styling}
          href={href}
          target={openInNewTab ? '_blank' : undefined}
          rel="noopener noreferrer">
          <div className={`${loading ? 'opacity-0' : ''}`}>{children}</div>
          {loading && <LoadingSpinner danger={danger} />}
        </Link>
      ) : (
        <button
          disabled={disabled}
          className={styling}
          onClick={loading ? doNothing : onClick}
          {...buttonProps}>
          <div className={`${loading ? 'opacity-0' : ''}`}>{children}</div>
          {loading && <LoadingSpinner danger={danger} />}
        </button>
      )}
    </>
  );
}

export default Button;
