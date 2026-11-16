import NavigationCards from "@/components/NavigationCards";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Personal Solutions in Jamaica",
  description: "Explore life and health insurance, critical illness cover, and retirement planning in Jamaica.",
  alternates: { canonical: "/personal-solutions" },
});

export default function PersonalSolutionsPage() {
  return (
    <div className="space-y-9">
      <header>
        <h1 className="text-3xl font-semibold text-brand sm:text-4xl">Personal Solutions</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Find insurance for yourself or your family, or explore ways to plan for retirement.</p>
      </header>
      <NavigationCards menu="personal" />
    </div>
  );
}
