"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteMenus } from "@/lib/site-navigation";

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const header = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  function close() {
    setActive("");
    setOpen(false);
  }

  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !header.current?.contains(event.target)) {
        setActive("");
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  return (
    <div ref={header} className="site-navigation"
      onKeyDown={event => {
        if (event.key !== "Escape" || (!active && !open)) return;
        event.stopPropagation();
        if (active) {
          trigger.current?.focus();
          setActive("");
        } else {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}>
      <button ref={menuButton} type="button" className="menu-toggle"
        aria-expanded={open} aria-controls="site-navigation"
        onClick={() => { setActive(""); setOpen(!open); }}>
        {open ? "Close" : "Menu"} <span aria-hidden>{open ? "×" : "☰"}</span>
      </button>
      <nav id="site-navigation" aria-label="Main navigation" className={`site-nav ${open ? "is-open" : ""}`}>
        <ul className="site-nav-items">
          {Object.entries(siteMenus).map(([id, { label, href, groups }]) => (
            <li key={id} className="site-nav-dropdown"
              onPointerEnter={event => {
                if (!open && event.pointerType === "mouse") setActive(id);
              }}
              onPointerLeave={event => {
                if (!open && event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) {
                  setActive(current => current === id ? "" : current);
                }
              }}
              onBlur={event => {
                if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(":hover")) {
                  setActive(current => current === id ? "" : current);
                }
              }}>
              <div className="site-nav-label">
                <Link href={href} aria-current={pathname === href ? "page" : undefined} onClick={close}>{label}</Link>
                <button type="button" className="site-nav-trigger" aria-expanded={active === id}
                  aria-label={`${label} submenu`} aria-controls={`nav-${id}`} ref={active === id ? trigger : null}
                  onClick={() => setActive(active === id ? "" : id)}>
                  <span aria-hidden>⌄</span>
                </button>
              </div>
              <div className="site-nav-panel" id={`nav-${id}`} hidden={active !== id}>
                {groups.map(group => (
                  <div key={group.title} className="site-nav-group">
                    <p>{group.title}</p>
                    {group.links.map(([name, href]) => (
                      <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={close}>{name}</Link>
                    ))}
                  </div>
                ))}
              </div>
            </li>
          ))}
          <li><Link href="/contact" aria-current={pathname === "/contact" ? "page" : undefined} onClick={close}>Client Care</Link></li>
          <li><Link href="/about" aria-current={pathname === "/about" ? "page" : undefined} onClick={close}>About Joanson</Link></li>
        </ul>
        <Link href="/book" className="nav-book" onClick={close}>Book a consultation <span aria-hidden>↗</span></Link>
      </nav>
    </div>
  );
}
