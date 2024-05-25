export default function LargeSpinner({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div
        className={
          'h-16 w-16 animate-spin rounded-full border-8 border-violet-600 border-t-violet-900'
        }
      />
    </div>
  );
}
