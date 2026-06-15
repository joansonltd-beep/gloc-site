// Responsive 16:9 video for the intro video (spec.md §9, §11).
// Priority: uploaded file (native player) > embed URL (iframe) > placeholder.
export default function VideoEmbed({
  fileUrl,
  url,
  title,
}: {
  fileUrl: string | null;
  url: string;
  title: string;
}) {
  if (fileUrl) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
        <video
          src={fileUrl}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full"
        >
          {title}
        </video>
      </div>
    );
  }

  if (url) {
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

  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-center text-white/70">
      <div>
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl">
          ▶
        </div>
        <p className="text-sm">Intro video coming soon</p>
      </div>
    </div>
  );
}
