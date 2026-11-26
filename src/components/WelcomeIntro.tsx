"use client";

import { useEffect, useState } from "react";

export default function WelcomeIntro({ brandClassName }: { brandClassName: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("joanson-intro-seen")) return;
      sessionStorage.setItem("joanson-intro-seen", "1");
    } catch {
      // The introduction still works when browser storage is unavailable.
    }
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 2400);
    const dismiss = () => setVisible(false);
    window.addEventListener("keydown", dismiss, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", dismiss);
    };
  }, []);

  if (!visible) return null;

  return (
    <aside className="welcome-intro" aria-label="Website introduction">
      <div className="welcome-intro-words" aria-hidden="true">
        {["Life", "Health", "Pensions", "Joanson"].map(word => (
          <span key={word} className={word === "Joanson" ? brandClassName : undefined}>{word}</span>
        ))}
      </div>
      <button type="button" onClick={() => setVisible(false)}>Skip intro</button>
    </aside>
  );
}
