import Link from "next/link";
import NavLink from "@/components/NavLink";

type Item = { href: string; label: string; external?: boolean };

// Nav tab with a hover dropdown of sub-pages. Clicking the tab itself still
// navigates to the hub page; the panel opens on hover or keyboard focus.
// On touch devices there is no hover, so tapping simply navigates to the hub,
// which links to every sub-page anyway.
// Items marked `external` render a plain <a> (used for static pages served
// outside the Next app, e.g. the /survey funnel).
export default function NavDropdown({
  href,
  label,
  items,
}: {
  href: string;
  label: string;
  items: Item[];
}) {
  const itemClass =
    "block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-brand/5 hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand";
  return (
    <div className="group relative inline-block">
      <NavLink href={href}>{label}</NavLink>
      {/* pt-2 bridges the hover gap between the tab and the panel */}
      <div className="invisible absolute left-1/2 top-full z-40 -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/10">
          {items.map((item) =>
            item.external ? (
              <a key={item.href} href={item.href} className={itemClass}>
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className={itemClass}>
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
