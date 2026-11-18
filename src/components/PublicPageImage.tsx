"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
const photographs: Record<string, [string, string]> = {
  protect: ["family-garden", "A family spending time together outdoors"],
  grow: ["retirement-planning", "An older couple reviewing documents together"],
  business: ["team-at-work", "A team working together at a construction site"],
  "business-solutions": ["team-at-work", "A team working together at a construction site"],
  "personal-solutions": ["family-dinner", "A family sharing a meal"],
  tools: ["agent-meeting", "People discussing documents at a table"],
  about: ["agent-meeting", "People discussing documents at a table"],
  contact: ["agent-meeting", "People discussing documents at a table"],
  book: ["agent-meeting", "People discussing documents at a table"],
  survey: ["family-garden", "A family spending time together outdoors"],
  privacy: ["agent-meeting", "People discussing documents at a table"],
  brochures: ["agent-meeting", "People discussing documents at a table"],
  insurers: ["agent-meeting", "People discussing documents at a table"],
  "coverage-enquiry": ["family-garden", "A family spending time together outdoors"],
  "insurance-enquiry": ["family-garden", "A family spending time together outdoors"],
};
const linePhotos: Record<string,[string,string]> = {
  health: ["health-checkup","A patient talking with a medical professional"],
  "critical-illness": ["clinic-conversation","A conversation in a clinic"],
  "life-insurance": ["family-dinner","A family sharing a meal"],
  "personal-accident": ["city-cyclist","A person cycling in the city"],
  "investments-mutual-funds": ["savings-together","People reviewing plans together"],
};
export default function PublicPageImage() {
  const path=usePathname().split('/').filter(Boolean);
  if(!path.length) return null;
  const photo=linePhotos[path[1]] || photographs[path[0]];
  if(!photo) return null;
  return <div className="public-page-photo"><Image src={`/images/stock/${photo[0]}.webp`} alt={photo[1]} fill sizes="(max-width: 760px) 100vw, 92vw" /></div>;
}
