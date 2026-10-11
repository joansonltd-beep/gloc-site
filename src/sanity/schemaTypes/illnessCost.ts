import { defineType, defineField } from "sanity";

// A critical-illness condition and the indicative cost of treating it (J$).
// Feeds the Critical Illness cost explorer on /protect. Placeholders, verify
// against local quotes (spec.md §10).
export const illnessCost = defineType({
  name: "illnessCost",
  title: "Critical illness cost",
  type: "document",
  fields: [
    defineField({
      name: "contentEdition",
      title: "Content edition",
      description:
        "Select Jamaica only after reviewing this document for the current market and business details.",
      type: "string",
      options: { list: [{ title: "Bulwark, Jamaica", value: "bulwark-v1" }] },
    }),
    defineField({
      name: "condition",
      title: "Condition",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "costLow",
      title: "Cost ,  low (J$)",
      type: "number",
      description: "Leave blank for conditions that are ongoing-care / varies.",
    }),
    defineField({
      name: "costHigh",
      title: "Cost ,  high (J$)",
      type: "number",
    }),
    defineField({
      name: "unit",
      title: "Cost basis",
      type: "string",
      options: {
        list: [
          { title: "Total (one event)", value: "total" },
          { title: "Per year", value: "year" },
          { title: "Per day", value: "day" },
        ],
        layout: "radio",
      },
      initialValue: "total",
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description: "Shown under the figure, e.g. 'often performed overseas'.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "condition", low: "costLow", high: "costHigh" },
    prepare: ({ title, low, high }) => ({
      title,
      subtitle:
        low != null || high != null
          ? `J$${(low ?? 0).toLocaleString()} - ${(high ?? 0).toLocaleString()}`
          : "varies",
    }),
  },
});
