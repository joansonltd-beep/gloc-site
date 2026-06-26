import { type SchemaTypeDefinition } from "sanity";

import { siteSettings } from "./siteSettings";
import { cluster } from "./cluster";
import { line } from "./line";
import { testimonial } from "./testimonial";
import { costFigure } from "./costFigure";
import { aboutContent } from "./aboutContent";
import { calculatorSettings } from "./calculatorSettings";
import { illnessCost } from "./illnessCost";
import { lineDetail } from "./lineDetail";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  cluster,
  line,
  lineDetail,
  testimonial,
  costFigure,
  aboutContent,
  calculatorSettings,
  illnessCost,
];
