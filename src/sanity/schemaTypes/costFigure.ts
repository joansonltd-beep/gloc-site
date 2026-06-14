import { defineType, defineField } from "sanity";

// An editable cost benchmark (spec.md §10, §11). Scenario + value.
// The `key` is what the Protection Planner looks up, so keep it stable.
export const costFigure = defineType({
  name: "costFigure",
  title: "Cost figure",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      description:
        "Stable id used by the code (do not change once live). e.g. orthopedicSurgeryHigh.",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      description: "Human-readable scenario, e.g. Major orthopedic surgery (high).",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "value",
      title: "Value (TT$)",
      type: "number",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "note",
      title: "Note",
      description: "Optional context, e.g. dated figure, re-quote before launch.",
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
    select: { title: "label", subtitle: "key", value: "value" },
    prepare: ({ title, subtitle, value }) => ({
      title: title || subtitle,
      subtitle: value != null ? `TT$${value.toLocaleString()}` : subtitle,
    }),
  },
});
