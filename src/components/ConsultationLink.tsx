import Link from "next/link";

// Shown wherever the site sends someone to a calculator: the calculator gives an
// estimate, and a one-on-one consultation is the next step.
export default function ConsultationLink({ withNote = false }: { withNote?: boolean }) {
  const link = (
    <Link className="button-text" href="/book">
      Book a one-on-one consultation <span aria-hidden>→</span>
    </Link>
  );
  if (!withNote) return link;
  return (
    <div className="max-w-2xl space-y-2 border-l-2 border-slate-300 pl-4">
      <p className="text-slate-600">
        A calculator gives you an estimate. Book a one-on-one consultation so we can go through your figures together and you know exactly where you stand.
      </p>
      {link}
    </div>
  );
}
