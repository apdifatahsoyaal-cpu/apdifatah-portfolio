export default function AdminLoading() {
  return (
    <div aria-label="Loading admin content" className="motion-safe:animate-pulse space-y-6">
      <div className="space-y-3">
        <div className="h-3 w-36 rounded bg-muted" />
        <div className="h-8 w-56 rounded bg-muted" />
        <div className="h-4 w-80 max-w-full rounded bg-muted" />
      </div>
      <div className="h-16 rounded-xl border border-border bg-background" />
      <div className="space-y-3 rounded-2xl border border-border bg-background p-5">
        <div className="h-12 rounded bg-muted" />
        <div className="h-12 rounded bg-muted" />
        <div className="h-12 rounded bg-muted" />
      </div>
    </div>
  );
}
