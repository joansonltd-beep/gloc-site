import type { Metadata } from "next";
import WhatsAppCTA from "@/components/tools/WhatsAppCTA";

export const metadata: Metadata = {
  title: "Book a call",
  description:
    "Book a no-pressure call with your Guardian Group adviser in Trinidad & Tobago.",
};

// Booking module is added later (spec.md §12). This is the pre-wired slot; for
// now visitors book via WhatsApp.
export default function BookPage() {
  const message = "Hi, I'd like to book a call to talk through my options.";

  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-accent-dark">
        Book a call
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
        Let&apos;s find a time to talk
      </h1>
      <p className="mt-3 text-lg text-slate-600">
        Online booking is coming soon. In the meantime, send a message and we will
        set up a time that works for you. No pressure, no obligation.
      </p>

      <div className="mt-8 flex justify-center">
        {/* Booking-module slot. Replaced with a calendar flow in M7. */}
        <WhatsAppCTA
          message={message}
          label="Book a call on WhatsApp"
          lead={{ source: "book-page" }}
        />
      </div>
    </div>
  );
}
