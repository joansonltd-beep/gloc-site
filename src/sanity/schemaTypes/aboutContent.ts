import { defineType, defineField } from "sanity";

// Singleton: About page content (spec.md §11). Used fully in M5.
export const aboutContent = defineType({
  name: "aboutContent",
  title: "About content",
  type: "document",
  fields: [
    defineField({
      name: "story",
      title: "Story",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "videoUrl",
      title: "HeyGen video URL",
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
      description: "Short blurb shown in the About teaser on the landing page.",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    prepare: () => ({ title: "About content" }),
  },
});
