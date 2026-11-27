import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Image and map credits", description: "Sources and credits for imagery and map data used on this website.", alternates: { canonical: "/credits" } });

export default function CreditsPage() {
  return <article className="space-y-6"><h1>Image and map credits</h1>
    <section className="space-y-3"><h2>Jamaica map</h2><p>The introductory map uses parish boundaries from <a href="https://www.geoboundaries.org/">geoBoundaries</a>, sourced from OpenStreetMap contributors and Wambacher, boundary ID JAM-ADM1-11528761. The boundaries were projected, converted to SVG and separated into shared borders for the animation.</p><p>The source dataset and derived map geometry are available under <a href="https://creativecommons.org/licenses/by-sa/2.0/">Creative Commons Attribution-ShareAlike 2.0</a>. <a href="https://github.com/wmgeolab/geoBoundaries/tree/main/releaseData/gbOpen/JAM/ADM1">View the source dataset</a>.</p></section>
    <section className="space-y-3"><h2>Intro photographs</h2><p>Life: Monstera Production, Pexels. Health: CDC, Pexels. Group Coverage: Tima Miroshnichenko, Pexels. Used under the <a href="https://www.pexels.com/license/">Pexels License</a>.</p><p>Pensions: <a href="https://pixabay.com/photos/couple-seniors-happy-smile-elderly-6962202/">AlisaDyson, Pixabay</a>, used under the <a href="https://pixabay.com/service/license-summary/">Pixabay Content License</a>.</p><p>These are stock photographs. The people pictured are not presented as clients, employees or endorsers.</p></section>
  </article>;
}
