import type { Metadata } from "next";
import CallbackForm from "@/components/CallbackForm";
import WhatsAppCTA from "@/components/tools/WhatsAppCTA";
import AdsConversion from "@/components/AdsConversion";

export const metadata: Metadata = {
  title: "Book a call",
  description:
    "Book a no-pressure call with your insurance agent in Trinidad & Tobago.",
};

// Booking module (calendar) is added later (spec.md §12). For now visitors can
// request a callback (writes to the lead sheet) or message on WhatsApp.
export default function BookPage() {
  const message = "Hi, I'd like to book a call to talk through my options.";

  return (
    <div className="mx-auto max-w-2xl">
      <AdsConversion sendTo="AW-18282133568/QM1DCMyU7sccEMDwzI1E" />
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-accent-dark">
          Book a call
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Let&apos;s find a time to talk
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Leave your details for a callback, or message on WhatsApp. No pressure,
          no obligation.
        </p>
      </div>

      <div className="mt-8">
        <CallbackForm />
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">Prefer to message now?</p>
        <div className="mt-2 flex justify-center">
          <WhatsAppCTA
            message={message}
            label="Chat on WhatsApp instead"
            lead={{ source: "book-page" }}
          />
        </div>
      </div>
    </div>
  );
}
