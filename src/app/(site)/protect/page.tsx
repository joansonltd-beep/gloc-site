import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import ProtectionPlanner from "@/components/tools/ProtectionPlanner";
import CriticalIllnessExplorer from "@/components/tools/CriticalIllnessExplorer";
import { getCluster, getLines, getCostFigures, getIllnessCosts } from "@/lib/siteData";

export const metadata: Metadata = {
  title: "Protect: Life, Health & Critical Illness",
  description:
    "Keep your family safe with life, health and critical illness cover. Try the Protection Planner.",
};

export default async function ProtectPage() {
  const [cluster, lines, costFigures, illnessCosts] = await Promise.all([
    getCluster("protect"),
    getLines("protect"),
    getCostFigures(),
    getIllnessCosts(),
  ]);

  return (
    <ClusterHub cluster={cluster} lines={lines}>
      <ProtectionPlanner costFigures={costFigures} />
      <CriticalIllnessExplorer illnessCosts={illnessCosts} />
    </ClusterHub>
  );
}
