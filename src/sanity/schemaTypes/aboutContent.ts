import { defineType, defineField } from "sanity";

// Singleton: About page content (spec.md §11). Used fully in M5.
export const aboutContent = defineType({
  name: "aboutContent",
  title: "About content",
  type: "document",
  fields: [
    defineField({
      name: "photo",
      title: "About-page photo",
      description:
        "Shown on the About page. Leave empty to reuse the Site-settings headshot.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "story",
      title: "Story",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "videoFile",
      title: "Intro video (upload a file)",
      description:
        "Upload an MP4 (recommended). This takes priority over the embed URL below.",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "videoUrl",
      title: "Or embed video URL",
      description:
        "A YouTube/Vimeo embed link, or a HeyGen SHARE link (share.heygen.com), not the app.heygen.com editor page. Used only if no file is uploaded.",
      type: "url",
    }),
    defineField({
      name: "credentials",
      title: "Credentials",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "teaser",
      title: "Home-page teaser",
      description:
        "A complete intro sentence or short paragraph shown on the landing page and under the About heading. Write it as a full sentence (e.g. start with the agent's name), not a fragment.",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    prepare: () => ({ title: "About content" }),
  },
});
