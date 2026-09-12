export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-navy/70" role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-teal/30 border-t-teal" />
      <p>{label}</p>
    </div>
  );
}
