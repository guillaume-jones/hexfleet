export default function LargeSpinner({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div
        className={
          'h-16 w-16 animate-spin rounded-full border-8 border-emerald-300 border-t-emerald-800'
        }
      />
    </div>
  );
}
