import type { Metadata } from "next";
import Image from "next/image";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import VideoEmbed from "@/components/VideoEmbed";
import LearnMore from "@/components/LearnMore";
import { getAbout, getSiteSettings } from "@/lib/siteData";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet your independent insurance agent in Trinidad & Tobago: story and a short intro video.",
};

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAbout(), getSiteSettings()]);
  const story = (about.story as PortableTextBlock[] | undefined) ?? null;
  const aboutPhoto = about.photoUrl ?? settings.headshotUrl;

  return (
    <div className="space-y-12">
      {/* Photo level/inline with the heading text. */}
      <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <header>
          <p className="text-sm font-medium uppercase tracking-wide text-accent-dark">
            {settings.agentTagline}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
            Meet {settings.agentName}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-slate-600">
            {about.teaser}
          </p>
        </header>

        {aboutPhoto ? (
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-2xl ring-1 ring-slate-200 md:mx-0">
            <Image
              src={aboutPhoto}
              alt={`${settings.agentName}, ${settings.agentTagline}`}
              fill
              sizes="(max-width: 768px) 240px, 240px"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="text-slate-700">
        <LearnMore>
          {story ? (
            <div className="space-y-4 leading-relaxed">
              <PortableText value={story} />
            </div>
          ) : (
            <div className="space-y-4">
              {about.storyParagraphs.map((p, i) => (
                <p key={i} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          )}
        </LearnMore>
      </div>

      <div className="max-w-2xl">
        <VideoEmbed
          fileUrl={about.videoFileUrl}
          url={about.videoUrl}
          title={`Intro from ${settings.agentName}`}
        />
      </div>
    </div>
  );
}
