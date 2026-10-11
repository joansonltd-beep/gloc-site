import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Product Information",
  description: "Discuss the current information relevant to your needs.",
  robots: { index: false, follow: true },
};
export default function BrochuresPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <p className="eyebrow">Product information</p>
      <h1 className="text-4xl font-semibold text-brand">
        Start with your questions.
      </h1>
      <p className="leading-relaxed text-slate-600">
        The guides on this site explain topics to consider. For current product
        information, availability and policy terms, book a conversation.
      </p>
      <Link href="/book" className="button-primary">
        Discuss my questions <span aria-hidden>↗</span>
      </Link>
    </div>
  );
}
