import { defineType, defineField } from "sanity";

// One of the four need-clusters (spec.md §4, §11).
export const cluster = defineType({
  name: "cluster",
  title: "Cluster",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      description: "Stable id used by the code: protect, grow, assets or business.",
      type: "string",
      options: {
        list: [
          { title: "Protect", value: "protect" },
          { title: "Grow", value: "grow" },
          { title: "Assets", value: "assets" },
          { title: "Business", value: "business" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "intent",
      title: "Visitor intent",
      description: 'e.g. "Keep my family safe".',
      type: "string",
    }),
    defineField({
      name: "lines",
      title: "Lines summary",
      description: 'Short list shown on cards, e.g. "Life · Health · Critical Illness".',
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "lines" },
  },
});
