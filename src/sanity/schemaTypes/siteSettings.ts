import { defineType, defineField } from "sanity";

// Singleton: global site settings (spec.md §11).
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      description:
        "Full international form, digits only, e.g. 18681234567. Powers every WhatsApp link.",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "glocAffiliationLine",
      title: "GLOC affiliation line",
      description: "e.g. Authorized Guardian Representative.",
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
