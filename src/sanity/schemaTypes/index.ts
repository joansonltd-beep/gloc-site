import { type SchemaTypeDefinition } from "sanity";

import { siteSettings } from "./siteSettings";
import { cluster } from "./cluster";
import { line } from "./line";
import { testimonial } from "./testimonial";
import { costFigure } from "./costFigure";
import { aboutContent } from "./aboutContent";
import { calculatorSettings } from "./calculatorSettings";
import { illnessCost } from "./illnessCost";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  cluster,
  line,
  testimonial,
  costFigure,
  aboutContent,
  calculatorSettings,
  illnessCost,
];
