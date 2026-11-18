"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ageRanges, coverageGoals } from "@/lib/insurance-enquiry";

const featured = [
  { label: "Coverage finder", short: "Find cover", photo: "family-garden" },
  { label: "Critical illness cover", short: "Critical illness", photo: "clinic-conversation", copySide: "right", href: "/protect/critical-illness", action: "Explore critical illness cover", description: "See how a policy can help with expenses after a covered diagnosis." },
  { label: "Life insurance", short: "Life insurance", photo: "family-dinner", href: "/protect/life-insurance", action: "Explore life insurance", description: "Explore life cover for the people who depend on you." },
  { label: "Health card", short: "Health", photo: "health-checkup", href: "/protect/health", action: "Explore health coverage", description: "Ask about health plans, medical benefits and how to use a health card." },
  { label: "Plan for retirement", short: "Retirement", photo: "retirement-bench", href: "/grow", action: "Explore retirement planning", description: "Talk through pension and annuity options for your retirement." },
  { label: "Group coverage", short: "Group cover", photo: "team-at-work", href: "/business", action: "Explore group coverage", description: "Compare group life, health and pension options for your team." },
];

export default function Hero({ headline, description }: { headline: string; description: string }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const slide = featured[active];
  const finder = !slide.href;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  // The active step's progress line is a CSS animation; when it finishes the
  // slider advances. Pausing the animation (hover, keyboard focus, Pause) pauses
  // the slider at the same point, so the line and the timing never drift apart.
  const paused = !playing || hovered || keyboardFocus;

  function select(index: number) {
    setActive((index + featured.length) % featured.length);
  }

  return (
    <section className="home-hero" data-copy-side={slide.copySide} data-paused={paused ? "true" : undefined}
      aria-label="Featured insurance services" aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={event => {
        if (event.target instanceof HTMLElement && event.target.matches(":focus-visible") &&
          !event.target.classList.contains("hero-control-toggle")) setKeyboardFocus(true);
      }}
      onBlurCapture={event => {
        if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget as Node)) setKeyboardFocus(false);
      }}>
      <div className="hero-photo" aria-hidden="true">
        {featured.map((item, index) => (
          <Image key={item.photo} src={`/images/stock/${item.photo}.webp`} data-photo={item.photo}
            alt="" fill preload={index === 0} sizes="100vw"
            className={index === active ? "hero-image is-active" : "hero-image"} />
        ))}
      </div>
      <div className="hero-frame">
        <div className="hero-copy" aria-live={playing && !reducedMotion ? "off" : "polite"}>
          <h1 className="sr-only">{headline}</h1>
          {finder ? (
            <>
              <h2>Find insurance coverage</h2>
              <form action="/insurance-enquiry" className="hero-finder" aria-label="Find insurance coverage">
                <label>Your age range
                  <select name="age" defaultValue="" required>
                    <option value="" disabled>Select an age range</option>
                    {ageRanges.map(age => <option key={age}>{age}</option>)}
                  </select>
                </label>
                <label>Looking for
                  <select name="goal" defaultValue="" required>
                    <option value="" disabled>Select a coverage goal</option>
                    {coverageGoals.map(goal => <option key={goal}>{goal}</option>)}
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
        <button type="button" className="hero-control-arrow" aria-label="Previous slide" onClick={() => select(active - 1)}>‹</button>
        <div className="hero-steps">
          {featured.map((item, index) => (
            <button key={item.label} type="button" className="hero-step"
              aria-label={`Show ${item.label}`} aria-current={active === index ? "true" : undefined}
              onClick={() => select(index)}>
              <span className="hero-step-label">{item.short}</span>
              <span className="hero-step-track" aria-hidden="true">
                {active === index && <span key={active} className="hero-step-fill"
                  onAnimationEnd={() => setActive((active + 1) % featured.length)} />}
              </span>
            </button>
          ))}
        </div>
        <button type="button" className="hero-control-arrow" aria-label="Next slide" onClick={() => select(active + 1)}>›</button>
        {!reducedMotion && <button type="button" className="hero-control-toggle"
          onMouseDown={event => event.preventDefault()}
          onClick={() => setPlaying(current => !current)}>{playing ? "Pause" : "Play"}</button>}
      </div>
    </section>
  );
}
