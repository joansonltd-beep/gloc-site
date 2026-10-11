// Add only current, confirmed product documents here.
export type Brochure = {
  slug: string;
  title: string;
  file: string;
  category: string;
  pages: string[];
};
export const BROCHURES: Brochure[] = [];
export const BROCHURE_CATEGORIES: string[] = [];
export function brochuresFor(pageKey: string): Brochure[] {
  return BROCHURES.filter((b) => b.pages.includes(pageKey));
}
