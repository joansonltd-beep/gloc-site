// Responsive 16:9 video embed for the HeyGen video (spec.md §9, §11).
// Shows a placeholder until a video URL is set in Sanity (About content).
export default function VideoEmbed({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  if (!url) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-center text-white/70">
        <div>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl">
            ▶
          </div>
          <p className="text-sm">Intro video</p>
          <p className="text-xs text-white/50">add the HeyGen URL in Sanity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <iframe
        src={url}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
