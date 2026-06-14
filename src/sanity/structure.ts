import type { StructureResolver } from "sanity/structure";

// Studio sidebar. Site settings and About content are singletons (one doc each);
// the rest are normal lists.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
      S.listItem()
        .title("About content")
        .id("aboutContent")
        .child(
          S.document().schemaType("aboutContent").documentId("aboutContent")
        ),
      S.divider(),
      S.documentTypeListItem("cluster").title("Clusters"),
      S.documentTypeListItem("line").title("Lines"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("costFigure").title("Cost figures"),
    ]);
