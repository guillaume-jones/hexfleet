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
      ? 'text-emerald-800 disabled:text-stone-600'
      : 'text-white disabled:text-stone-300'
  }
  ${fontClassName ? fontClassName : light ? 'font-semibold' : 'font-medium'}
  ${
    fixedActive
      ? light
        ? 'bg-emerald-400'
        : danger
        ? 'bg-red-500'
        : 'bg-emerald-500'
      : light
      ? 'bg-stone-50 disabled:bg-stone-300 sm:hover:bg-emerald-200 sm:active:bg-emerald-300 sm:disabled:bg-stone-300'
      : danger
      ? 'bg-red-600 disabled:bg-stone-400 sm:hover:bg-red-500 sm:active:bg-red-400 sm:disabled:bg-stone-400'
      : 'bg-emerald-700 disabled:bg-stone-500 sm:hover:bg-emerald-600 sm:active:bg-emerald-500 sm:disabled:bg-stone-500'
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
