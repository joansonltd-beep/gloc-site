"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Nav link that highlights the current section.
export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded border-b-2 pb-0.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        active
          ? "border-accent font-semibold text-accent-dark"
          : "border-transparent text-slate-600 hover:text-brand"
      }`}
    >
      {children}
    </Link>
  );
}
