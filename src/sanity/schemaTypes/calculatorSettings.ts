import { defineType, defineField } from "sanity";

// Singleton: editable return/inflation rates for the Grow projectors (spec.md §7).
// Entered as percentages (e.g. 2.5 means 2.5%/yr); the site converts to decimals.
export const calculatorSettings = defineType({
  name: "calculatorSettings",
  title: "Calculator settings",
  type: "document",
  fields: [
    defineField({
      name: "investmentLowReturn",
      title: "Investment — cautious return (% per year)",
      type: "number",
      description: "Lower end of the projected range. e.g. 2.5",
    }),
    defineField({
      name: "investmentHighReturn",
      title: "Investment — optimistic return (% per year)",
      type: "number",
      description: "Upper end of the projected range. e.g. 8",
    }),
    defineField({
      name: "pensionSavingsReturn",
      title: "Pension — plain savings return (% per year)",
      type: "number",
      description: "e.g. 1",
    }),
    defineField({
      name: "pensionStructuredReturn",
      title: "Pension — structured plan return (% per year)",
      type: "number",
      description: "e.g. 6",
    }),
    defineField({
      name: "pensionInflation",
      title: "Pension — assumed inflation (% per year)",
      type: "number",
      description: "Used to show TT-dollar erosion. e.g. 4",
    }),
  ],
  preview: { prepare: () => ({ title: "Calculator settings" }) },
});
