import NavigationCards from "@/components/NavigationCards";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Business Solutions in Jamaica",
  description: "Explore group life, health and pension options for employees in Jamaica.",
  alternates: { canonical: "/business-solutions" },
});

export default function BusinessSolutionsPage() {
  return (
    <div className="space-y-9">
      <header>
        <h1 className="text-3xl font-semibold text-brand sm:text-4xl">Business Solutions</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Explore employee benefits or send an enquiry about group coverage for your team.</p>
      </header>
      <NavigationCards menu="business" />
    </div>
  );
}
