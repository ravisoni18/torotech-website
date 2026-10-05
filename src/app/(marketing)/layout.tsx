import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Analytics } from "@/components/marketing/Analytics";
import { JsonLd } from "@/components/marketing/JsonLd";
import { CopyAttribution } from "@/components/marketing/CopyAttribution";
import { organizationLd, websiteLd } from "@/lib/seo";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <Analytics />
      <CopyAttribution />
      <JsonLd data={[organizationLd(), websiteLd()]} />
    </>
  );
}
