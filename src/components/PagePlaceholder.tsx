// Shared M0 placeholder. Each route renders this until its real content
// is built in a later milestone. Remove when the page gets real content.
export default function PagePlaceholder({
  title,
  note,
  milestone,
}: {
  title: string;
  note: string;
  milestone: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
        Placeholder, content arrives in {milestone}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-2xl text-slate-600">{note}</p>
    </div>
  );
}
