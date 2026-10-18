import { pageMetadata } from '@/lib/seo';
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How this website collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
});

// Plain-language privacy policy covering the callback form, WhatsApp hand-off
// and Google Ads tag. Kept short on purpose; not legal advice.
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header>
        <span className="block h-1.5 w-24 rounded-full bg-swoosh" />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          The short version: the details you share here are used to respond to
          your enquiry or understand the planning needs shared in a survey.
        </p>
      </header>

      <section className="space-y-3 text-slate-700">
        <h2 className="text-xl font-semibold text-brand">What we collect</h2>
        <p>
          Bulwark Insurance Agency Ltd uses the details you provide when you request a consultation or book a meeting. We collect the details
          you choose to give: your name, phone number, and any optional
          information you add, such as your preferred contact time, insurance needs or message. Other enquiry forms may request information relevant to the cover you are considering. The interactive
          calculators run in your browser; the numbers you enter there are only
          sent to us if you choose to continue on WhatsApp or submit a form.
        </p>
      </section>

      <section className="space-y-3 text-slate-700">
        <h2 className="text-xl font-semibold text-brand">How we use it</h2>
        <p>
          Survey responses help us understand planning needs. Enquiry details
          are used to contact you and to prepare for our conversation. They are
          sent to the configured lead-capture service. We do not sell or share
          your information with third parties for their own marketing.
        </p>
      </section>

      <section className="space-y-3 text-slate-700">
        <h2 className="text-xl font-semibold text-brand">WhatsApp</h2>
        <p>
          If you choose to message on WhatsApp, your conversation is handled by
          WhatsApp under its own terms and privacy policy.
        </p>
      </section>

      <section className="space-y-3 text-slate-700">
        <h2 className="text-xl font-semibold text-brand">
          Cookies and analytics
        </h2>
        <p>
          This site uses the Google tag to measure how visitors find the site
          and whether our advertising works. This may set cookies in your
          browser. You can block or clear cookies in your browser settings at
          any time; the site works fine without them.
        </p>
      </section>

      <section className="space-y-3 text-slate-700">
        <h2 className="text-xl font-semibold text-brand">Your choices</h2>
        <p>
          You can ask at any time to see the details we hold about you, have
          them corrected, or have them deleted.{" "}
          <Link
            href="/contact"
            className="font-semibold text-brand hover:underline"
          >
            Contact us
          </Link>{" "}
          and we will sort it out.
        </p>
      </section>
    </div>
  );
}
