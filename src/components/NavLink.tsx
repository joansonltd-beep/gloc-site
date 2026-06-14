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
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        active ? "font-semibold text-brand" : "text-slate-600"
      }`}
    >
      {children}
    </Link>
  );
}
