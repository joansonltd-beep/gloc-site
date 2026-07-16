// Shared SVG icon set (no emoji; see UI guidelines). Line icons are simple,
// consistent outline glyphs in currentColor; brand icons are filled. Used across
// the product hubs, contact page, about teaser and form success states.
import type { ReactNode } from "react";

type IconProps = { className?: string };

// Outline base: 24x24, currentColor stroke, rounded joins.
function Stroke({ className = "", children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

// Filled base for brand marks.
function Fill({ className = "", children }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      {children}
    </svg>
  );
}

// --- line / product icons ----------------------------------------------
export const Shield = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M12 3l7 2.5v5.2c0 4.6-3.1 7.9-7 9.3-3.9-1.4-7-4.7-7-9.3V5.5L12 3z" />
  </Stroke>
);

export const Health = ({ className }: IconProps) => (
  <Stroke className={className}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    <path d="M12 8v8M8 12h8" />
  </Stroke>
);

export const Heart = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M12 20s-6.5-4.1-8.6-8.2C2.1 8.9 3.4 5.5 6.6 5.5c1.9 0 3.2 1.1 4 2.3.8-1.2 2.1-2.3 4-2.3 3.2 0 4.5 3.4 3.2 6.3C18.5 15.9 12 20 12 20z" />
  </Stroke>
);

export const LifeBuoy = ({ className }: IconProps) => (
  <Stroke className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3.3" />
    <path d="M12 3.5v5.2M12 15.3v5.2M3.5 12h5.2M15.3 12h5.2" />
  </Stroke>
);

export const Umbrella = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M12 3v2M4 11a8 8 0 0 1 16 0H4z" />
    <path d="M12 11v6.5a2.5 2.5 0 0 0 5 0" />
  </Stroke>
);

export const ChartUp = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M4 4v16h16" />
    <path d="M7 15l3.5-3.5 3 3L20 8" />
    <path d="M16 8h4v4" />
  </Stroke>
);

export const Car = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M5 16v-3l1.8-4.2A2 2 0 0 1 8.6 7.5h6.8a2 2 0 0 1 1.8 1.3L19 13v3" />
    <path d="M4 16h16M8 13h8" />
    <circle cx="8" cy="16.5" r="1.5" />
    <circle cx="16" cy="16.5" r="1.5" />
  </Stroke>
);

export const HomeIcon = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M4 11l8-6 8 6" />
    <path d="M6 10v9h12v-9" />
    <path d="M10 19v-5h4v5" />
  </Stroke>
);

export const Building = ({ className }: IconProps) => (
  <Stroke className={className}>
    <rect x="5" y="3.5" width="14" height="17" rx="1.5" />
    <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    <path d="M10 20.5v-2.5h4v2.5" />
  </Stroke>
);

export const Users = ({ className }: IconProps) => (
  <Stroke className={className}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.2a3 3 0 0 1 0 5.6" />
    <path d="M15.6 13.6A5.5 5.5 0 0 1 20.5 19" />
  </Stroke>
);

// --- contact / utility icons -------------------------------------------
export const Chat = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.3-4.1A7.5 7.5 0 1 1 20 11.5z" />
  </Stroke>
);

export const Mobile = ({ className }: IconProps) => (
  <Stroke className={className}>
    <rect x="7" y="3" width="10" height="18" rx="2.5" />
    <path d="M11 17.5h2" />
  </Stroke>
);

export const Phone = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M6.5 4h3l1.4 3.6-2 1.4a10 10 0 0 0 5 5l1.4-2 3.6 1.4v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4z" />
  </Stroke>
);

export const User = ({ className }: IconProps) => (
  <Stroke className={className}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </Stroke>
);

export const Check = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M5 12.5l4 4 10-10" />
  </Stroke>
);

export const FileText = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-6-6z" />
    <path d="M13 3v6h6" />
    <path d="M9 13h6M9 17h4" />
  </Stroke>
);

export const ChevronLeft = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M14.5 5.5L8 12l6.5 6.5" />
  </Stroke>
);

export const ChevronRight = ({ className }: IconProps) => (
  <Stroke className={className}>
    <path d="M9.5 5.5L16 12l-6.5 6.5" />
  </Stroke>
);

// --- brand marks --------------------------------------------------------
export const Facebook = ({ className }: IconProps) => (
  <Fill className={className}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
  </Fill>
);

export const Instagram = ({ className }: IconProps) => (
  <Fill className={className}>
    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.1.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.1-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.1-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.1 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 9.9 2.6 10.3 2.6 12s0 2.1.1 3.3c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-3.3s0-2.1-.1-3.3c-.1-1.1-.2-1.7-.4-2.1a3.5 3.5 0 0 0-.8-1.3 3.5 3.5 0 0 0-1.3-.8c-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2zm6.3-8.2a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z" />
  </Fill>
);

// --- lookups ------------------------------------------------------------
// Map a product-line slug to its icon so rendering never depends on an emoji
// string in the content/CMS data.
const LINE_ICONS: Record<string, (p: IconProps) => ReactNode> = {
  "life-insurance": Shield,
  health: Health,
  "critical-illness": Heart,
  "personal-accident": LifeBuoy,
  "pension-annuities": Umbrella,
  "investments-mutual-funds": ChartUp,
  motor: Car,
  home: HomeIcon,
  property: Building,
  "group-employee-benefits": Users,
};

export function LineIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = LINE_ICONS[slug] ?? Shield;
  return <Icon className={className} />;
}
