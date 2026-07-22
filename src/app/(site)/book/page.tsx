import type { Metadata } from "next";
import CallbackForm from "@/components/CallbackForm";
import WhatsAppCTA from "@/components/tools/WhatsAppCTA";
import AdsConversion from "@/components/AdsConversion";

export const metadata: Metadata = {
  title: "Book a Meeting",
  description:
    "Book a no-pressure meeting with your insurance agent in Trinidad & Tobago, or request a callback.",
  alternates: { canonical: "/book" },
};

// Google Calendar appointment schedule. The embed URL (gv=true) renders the
// booking calendar directly on the page; the short link is the fallback.
const BOOKING_EMBED_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2ZbBd9S3O9dRFKwFRL1zyjKkrjLP2HQpJADSqUd9V-hHmW4gy080RvusjDlC3hiK4kWSAq4Zng?gv=true";
const BOOKING_LINK = "https://calendar.app.google/3DtkDC6QQGak5UGB6";

export default function BookPage() {
  const message = "Hi, I'd like to book a meeting to talk through my options.";

  return (
    <div className="mx-auto max-w-3xl">
      <AdsConversion sendTo="AW-18282133568/QM1DCMyU7sccEMDwzI1E" />
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-accent-dark">
          Book a Meeting
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Let&apos;s find a time to talk
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Pick a time on the calendar below, request a callback, or message on
          WhatsApp. No pressure, no obligation.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <iframe
          src={BOOKING_EMBED_URL}
          title="Book a meeting"
          className="h-[42rem] w-full"
          loading="lazy"
        />
      </div>
      <p className="mt-2 text-center text-sm text-slate-500">
        Calendar not loading?{" "}
        <a
          href={BOOKING_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand hover:underline"
        >
          Open the booking page in a new tab
        </a>
        .
      </p>

      <div className="mt-10 text-center">
        <h2 className="text-xl font-semibold tracking-tight text-brand">
          Prefer a callback?
        </h2>
        <p className="mt-1 text-slate-600">
          Leave your details and I&apos;ll call you back instead.
        </p>
      </div>

      <div className="mt-4">
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
