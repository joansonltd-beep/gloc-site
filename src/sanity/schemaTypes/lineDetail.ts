import { defineType, defineField } from "sanity";

// Editable copy for an individual product page ("what it is / why it matters").
// The calculator/tool shown on each page stays defined in code; only the text
// is editable here.
export const lineDetail = defineType({
  name: "lineDetail",
  title: "Product page content",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug (page URL)",
      type: "slug",
      options: { source: "title" },
      description: "Must match the product's page URL, e.g. life-insurance.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "clusterKey",
      title: "Section",
      type: "string",
      options: {
        list: [
          { title: "Protect", value: "protect" },
          { title: "Grow", value: "grow" },
          { title: "Assets", value: "assets" },
          { title: "Business", value: "business" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({
      name: "what",
      title: "What it is (paragraphs)",
      type: "array",
      of: [{ type: "text", rows: 3 }],
    }),
    defineField({
      name: "why",
      title: "Why it matters (bullet points)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "clusterKey" } },
});
