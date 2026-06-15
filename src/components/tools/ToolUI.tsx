// Shared UI building blocks for the interactive tools (spec.md §7).
// Kept generic so every tool looks consistent and stays easy to edit.

export function ToolFrame({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-8">
      <h3 className="text-xl font-semibold text-brand">{title}</h3>
      <p className="mt-1 max-w-prose text-sm text-slate-600">{intro}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "number",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        type={type}
        inputMode={type === "number" ? "numeric" : undefined}
        min={type === "number" ? 0 : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ResultCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-accent-dark">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-brand">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </div>
  );
}

export function Assumptions({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-400">
      <span className="font-semibold text-slate-500">Assumptions: </span>
      {children}
    </p>
  );
}
