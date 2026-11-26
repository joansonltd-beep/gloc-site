"use client";

import { plainInsuranceText } from "@/lib/plain-insurance-text";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ageRanges, coverageGoals } from "@/lib/insurance-enquiry";

const featured = [
  { label: "Insurance finder", photo: "pexels-8236397" },
  { label: "Critical illness insurance", photo: "clinic-conversation", copySide: "right", href: "/protect/critical-illness", action: "Explore critical illness insurance", description: "A cash benefit after a qualifying serious illness can help with treatment, everyday bills and time away from work." },
  { label: "Life insurance", photo: "family-dinner", href: "/protect/life-insurance", action: "Explore life insurance", description: "Help the people you leave behind pay household bills, school fees and debts when you die." },
  { label: "Health Insurance", photo: "health-checkup", href: "/protect/health", action: "Explore health insurance", description: "Help pay for eligible doctor visits, prescriptions, tests and hospital care, depending on the plan." },
  { label: "Plan for retirement", photo: "retirement-bench", href: "/grow", action: "Explore retirement planning", description: "Build savings for retirement and explore ways to turn those savings into a regular income." },
  { label: "Group insurance", photo: "team-at-work", href: "/business", action: "Explore group insurance", description: "Help your employees plan for medical expenses, provide for their families and save for retirement." },
];

export default function Hero({ headline, description }: { headline: string; description: string }) {
  const [active, setActive] = useState(0);
  const slide = featured[active];
  const finder = !slide.href;

  function select(index: number) {
    setActive((index + featured.length) % featured.length);
  }

  return (
    <section className="home-hero" data-copy-side={slide.copySide}
      aria-label="Featured insurance services" aria-roledescription="carousel">
      <div className="hero-photo" aria-hidden="true">
        {featured.map((item, index) => (
          <Image key={item.photo} src={`/images/stock/${item.photo}.webp`} data-photo={item.photo}
            alt="" fill preload={index === 0} sizes="100vw"
            className={index === active ? "hero-image is-active" : "hero-image"} />
        ))}
      </div>
      <div className="hero-frame">
        <div className="hero-copy" aria-live="polite">
          <h1 className="sr-only">{headline}</h1>
          {finder ? (
            <>
              <h2>Find insurance</h2>
              <form action="/insurance-enquiry" className="hero-finder" aria-label="Find insurance">
                <label>Your age range
                  <select name="age" defaultValue="" required>
                    <option value="" disabled>Select an age range</option>
                    {ageRanges.map(age => <option key={age}>{age}</option>)}
                  </select>
                </label>
                <label>Looking for
                  <select name="goal" defaultValue="" required>
                    <option value="" disabled>Choose a type of insurance</option>
                    {coverageGoals.map(goal => <option key={goal} value={goal}>{plainInsuranceText(goal)}</option>)}
                  </select>
                </label>
                <button type="submit" className="hero-slide-link">Let&apos;s go <span aria-hidden>→</span></button>
              </form>
            </>
          ) : (
            <>
              <h2>{slide.label}</h2>
              <p className="hero-description">{slide.description ?? description}</p>
              <Link href={slide.href ?? "/protect"} className="hero-slide-link">{slide.action} <span aria-hidden>→</span></Link>
            </>
          )}
        </div>
      </div>
      <div className="hero-controls" aria-label="Slideshow controls">
        <div className="hero-steps">
          {featured.map((item, index) => (
            <button key={item.label} type="button" className="hero-step"
              aria-label={`Show ${item.label}`} aria-current={active === index ? "true" : undefined}
              onClick={() => select(index)}>
              <span className="hero-step-track" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
