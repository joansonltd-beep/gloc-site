import type { Metadata } from "next";
import { Archivo, DM_Sans } from "next/font/google";
import Link from "next/link";
import FeedbackForm from "./feedback-form";
import "./feedback.css";

const bodyFont = Archivo({ subsets: ["latin"], display: "swap" });
const headingFont = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--feedback-heading" });

export const metadata: Metadata = {
  title: "Anonymous Feedback | Joanson",
  description: "Share what has kept you from getting insurance.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function AnonymousFeedbackPage() {
  return (
    <main className={"anonymous-feedback " + bodyFont.className + " " + headingFont.variable}>
      <Link href="/" className="feedback-brand">Joanson</Link>
      <h1>What is keeping you from getting insurance?</h1>
      <p>Cost, trust, finding the right cover or something else. Share what has made it difficult for you.</p>
      <p>Share as much or as little as you like. You can use a nickname or leave the username blank.</p>
      <FeedbackForm />
      <Link href="/privacy" className="feedback-privacy">Privacy policy</Link>
    </main>
  );
}
