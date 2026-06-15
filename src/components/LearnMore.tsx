"use client";

import { useState } from "react";

// Hides longer content behind a "Learn more" toggle.
export default function LearnMore({
  label = "Learn more about me",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {open ? "Show less" : label}
        <span aria-hidden className={`transition ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {open ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
