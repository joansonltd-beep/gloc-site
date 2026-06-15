import type { Metadata } from "next";
import Image from "next/image";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import VideoEmbed from "@/components/VideoEmbed";
import { getAbout, getSiteSettings } from "@/lib/siteData";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet your independent Guardian Group adviser in Trinidad & Tobago: story, credentials and a short intro video.",
};

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAbout(), getSiteSettings()]);
  const story = (about.story as PortableTextBlock[] | undefined) ?? null;

  return (
    <div className="space-y-12">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-accent-dark">
          {settings.agentTagline}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Meet {settings.agentName}
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          {settings.agentName} is {about.teaser}
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="space-y-4 text-slate-700">
          {story ? (
            <div className="space-y-4 leading-relaxed">
              <PortableText value={story} />
            </div>
          ) : (
            about.storyParagraphs.map((p, i) => (
              <p key={i} className="leading-relaxed">
                {p}
              </p>
            ))
          )}
        </div>

        <aside className="space-y-8">
          {settings.headshotUrl ? (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
              <Image
                src={settings.headshotUrl}
                alt={`${settings.agentName}, ${settings.agentTagline}`}
                fill
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover"
              />
            </div>
          ) : null}

          <VideoEmbed url={about.videoUrl} title={`Intro from ${settings.agentName}`} />

          {about.credentials.length > 0 && (
            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Credentials
              </h2>
              <ul className="mt-3 space-y-2">
                {about.credentials.map((c) => (
                  <li key={c} className="flex gap-2 text-sm text-slate-700">
                    <span aria-hidden className="text-accent-dark">
                      ✓
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              {settings.glocAffiliationLine ? (
                <p className="mt-4 text-xs text-slate-400">
                  {settings.glocAffiliationLine}
                </p>
              ) : null}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
