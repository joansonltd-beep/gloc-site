"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoOutline } from "@/lib/logo-outline";
import { jamaicaOutline } from "@/lib/jamaica-outline";

const slides = [
  { word: "Life", photo: "life", alt: "A family spending time together at home" },
  { word: "Health and Critical Illness", photo: "health", alt: "A patient talking with her doctor" },
  { word: "Pension and Retirement Plans", photo: "pensions-couple", alt: "An older Black couple smiling together outdoors" },
  { word: "Group Coverage", photo: "group", alt: "Three colleagues wearing matching red and grey work uniforms" },
];
const words = [...slides.map(slide => slide.word), "Joanson"];

export default function WelcomeIntro({ brandClassName, taglineClassName, lifeClassName, previewEnabled = false }: { brandClassName: string; taglineClassName: string; lifeClassName: string; previewEnabled?: boolean }) {
  const pathname = usePathname();
  const eligiblePage = pathname === "/" || pathname === "/book";
  const [visible, setVisible] = useState(false);
  const [preview, setPreview] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setVisible(false);
    setPreview(false);
    if (!eligiblePage) return;
    setPlaying(true);
    setActive(0);
    setRun(value => value + 1);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reduce);
    if (previewEnabled && new URLSearchParams(window.location.search).get("introPreview") === "1") {
      setPreview(true);
      setPlaying(false);
      setVisible(true);
      return;
    }
    if (reduce) return;
    try {
      if (sessionStorage.getItem("joanson-intro-v2-seen")) return;
      sessionStorage.setItem("joanson-intro-v2-seen", "1");
    } catch {
      // Storage is optional; the page remains available underneath the intro.
    }
    setVisible(true);
  }, [previewEnabled, pathname, eligiblePage]);

  useEffect(() => {
    if (!visible || !playing) return;
    const timer = window.setTimeout(() => {
      if (preview) { setPlaying(false); setActive(slides.length); }
      else setVisible(false);
    }, 12300);
    const dismiss = () => { if (!preview) setVisible(false); };
    window.addEventListener("keydown", dismiss, { once: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("keydown", dismiss); };
  }, [visible, playing, preview, run]);

  if (!eligiblePage || !visible) return null;

  return (
    <aside className="welcome-intro" aria-label="Website introduction" data-mode={playing ? "playing" : "inspect"} data-preview={preview ? "true" : undefined} data-frame={active}>
      <div key={run} className="intro-frames" aria-hidden="true">
        {slides.map(slide => (
          <div key={slide.word} className={"intro-slide intro-slide-" + slide.photo}>
            <div className="intro-image"><Image src={"/images/intro/" + slide.photo + ".webp"} alt={slide.alt} fill sizes="100vw" loading="eager" /></div>
            <span className={`intro-slide-label ${taglineClassName}`}>{slide.photo === "group" ? <>Group<br />Coverage</> : slide.photo === "health" ? <>Health and<br />Critical Illness</> : slide.photo === "pensions-couple" ? <>Pension and<br />Retirement Plans</> : slide.word}</span>
          </div>
        ))}
        <div className="intro-slide intro-brand">
          <div className="intro-brand-lockup">
          <div className="intro-jamaica">
            <svg viewBox={jamaicaOutline.viewBox} fill="none" aria-hidden="true">
              <defs><clipPath id="intro-jamaica-clip"><path d={jamaicaOutline.d} /></clipPath></defs>
              <g className="intro-flag" clipPath="url(#intro-jamaica-clip)">
                <rect width="1850" height="760" fill="#009b3a" />
                <path d="M0 0 L925 380 L0 760 Z M1850 0 L925 380 L1850 760 Z" fill="#000" />
                <path d="M0 0 L1850 760 M0 760 L1850 0" stroke="#fed100" strokeWidth="85" />
              </g>
              <path className="intro-coastline intro-coastline-north" pathLength="1" d={jamaicaOutline.north} stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
              <path className="intro-coastline intro-coastline-south" pathLength="1" d={jamaicaOutline.south} stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
              {jamaicaOutline.parishes.map((d, i) => <path key={i} className="intro-parish" d={d} pathLength="1" style={{ animationDelay: `${6800 + i * 15}ms` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />)}
            </svg>
            <div className="intro-name-lockup">
              <svg className="intro-logo" viewBox={logoOutline.viewBox} aria-hidden="true">
                <image className="intro-logo-colour" href="/brand/joanson-pillars-green-yellow-black.png" width="160" height="160" />
                {logoOutline.paths.map((d, i) => <path key={i} d={d} fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" pathLength="1" />)}
              </svg>
              <span className={brandClassName}>Joanson</span>
            </div>
          </div>
          <div className="intro-brand-signoff">
            <p className={`intro-brand-tagline ${taglineClassName}`}>Your <span className="intro-agent">agent</span> for <em className={lifeClassName}>life</em></p>
          </div>
          </div>
        </div>
      </div>
      {preview ? <nav className="intro-preview-controls" aria-label="Intro preview controls">
        {words.map((word, index) => <button key={word} type="button" aria-pressed={!playing && active === index} onClick={() => { setPlaying(false); setActive(index); }}>{word}</button>)}
        <button type="button" className="intro-play" disabled={reduced} onClick={() => { setRun(value => value + 1); setPlaying(true); }}>Play intro</button>
        <button type="button" onClick={() => setVisible(false)}>Close preview</button>
      </nav> : <button type="button" className="intro-skip" onClick={() => setVisible(false)}>Skip intro</button>}
    </aside>
  );
}
