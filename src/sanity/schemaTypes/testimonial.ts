import { defineType, defineField } from "sanity";

// A client testimonial (spec.md §11).
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "person",
      title: "Person",
      description: 'e.g. "Kerry-Ann, 29 · Port of Spain".',
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "relatedLine",
      title: "Related line",
      description: 'e.g. "Life + Critical Illness".',
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
    select: { title: "person", subtitle: "relatedLine" },
  },
});
