export default function LoadingSpinner({
  danger,
  className,
}: {
  danger?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`absolute h-5 w-5 animate-spin rounded-full border-2 ${
        danger
          ? 'border-red-400 border-r-red-800'
          : 'border-violet-500 border-r-violet-900'
      } ${className ?? ''}`}
    />
  );
}
