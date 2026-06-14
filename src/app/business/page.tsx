import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import GroupBenefitsEnquiry from "@/components/tools/GroupBenefitsEnquiry";

export const metadata: Metadata = {
  title: "Business: Group & Employee Benefits",
  description:
    "Cover your team with group health, life and pension benefits. Send an enquiry.",
};

export default function BusinessPage() {
  return (
    <ClusterHub cluster="business">
      <GroupBenefitsEnquiry />
    </ClusterHub>
  );
}
