import Link from "next/link";
import { siteMenus } from "@/lib/site-navigation";

export default function NavigationCards({ menu }: { menu: keyof typeof siteMenus }) {
  return (
    <nav aria-label={siteMenus[menu].label} className="space-y-8">
      {siteMenus[menu].groups.map(({ title, links }) => (
        <section key={title}>
          <h2 className="mb-4 text-xl font-semibold text-brand">{title}</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {links.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="flex h-full items-center justify-between gap-4 border border-slate-200 bg-white p-5 font-semibold text-brand hover:bg-slate-100 hover:underline">
                  {label} <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
