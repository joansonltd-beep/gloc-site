"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  { href: "/protect", label: "Family & health" },
  { href: "/grow", label: "Your future" },
  { href: "/assets", label: "Home & motor" },
  { href: "/business", label: "Group Coverage" },
  { href: "/about", label: "About" },
];
export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <>
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden>{open ? "×" : "☰"}</span>
      </button>
      <nav
        id="site-navigation"
        aria-label="Main navigation"
        className={`site-nav ${open ? "is-open" : ""}`}
      >
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={
                  pathname === l.href || pathname.startsWith(`${l.href}/`)
                    ? "page"
                    : undefined
                }
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/book" className="nav-book" onClick={() => setOpen(false)}>
          Let&apos;s talk <span aria-hidden>↗</span>
        </Link>
      </nav>
    </>
  );
}
