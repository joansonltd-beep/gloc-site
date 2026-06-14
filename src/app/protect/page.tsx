import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import ProtectionPlanner from "@/components/tools/ProtectionPlanner";

export const metadata: Metadata = {
  title: "Protect: Life, Health & Critical Illness",
  description:
    "Keep your family safe with life, health and critical illness cover. Try the Protection Planner.",
};

export default function ProtectPage() {
  return (
    <ClusterHub cluster="protect">
      <ProtectionPlanner />
    </ClusterHub>
  );
}
