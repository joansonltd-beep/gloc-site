import { defineType, defineField } from "sanity";

// A product line within a cluster (spec.md §11).
export const line = defineType({
  name: "line",
  title: "Line",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "blurb",
      title: "Blurb",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "An emoji or short symbol shown on the card.",
      type: "string",
    }),
    defineField({
      name: "cluster",
      title: "Cluster",
      type: "reference",
      to: [{ type: "cluster" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "cluster.title" },
  },
});
