import { defineType, defineField } from "sanity";

// Singleton: global site settings (spec.md §11).
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "contentEdition",
      title: "Content edition",
      description:
        "Select Jamaica only after reviewing this document for the current market and business details.",
      type: "string",
      options: { list: [{ title: "Joanson, Jamaica", value: "joanson-v1" }] },
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      description:
        "Full international form, digits only, include the country code. Powers every WhatsApp link.",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "professionalDescription",
      title: "Professional description",
      description: "Use only a current, confirmed professional description.",
      type: "string",
    }),
    defineField({
      name: "footerDisclaimer",
      title: "Footer disclaimer",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "agentName",
      title: "Agent name",
      type: "string",
    }),
    defineField({
      name: "agentTagline",
      title: "Agent tagline",
      type: "string",
    }),
    defineField({
      name: "headshot",
      title: "Agent headshot / photo",
      description:
        "Used in the hero, the About page, and the home-page teaser.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "logo",
      title: "Logo",
      description:
        "Shown in the header and footer. A white background is fine; it blends away automatically.",
      type: "image",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook URL",
      type: "url",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "tiktokUrl",
      title: "TikTok URL",
      type: "url",
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
    }),
    defineField({
      name: "xUrl",
      title: "X (Twitter) URL",
      type: "url",
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero eyebrow",
      description: "Small line above the hero headline.",
      type: "string",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      type: "string",
    }),
    defineField({
      name: "heroSubcopy",
      title: "Hero subcopy",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
