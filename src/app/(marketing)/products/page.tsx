import type { Metadata } from "next";
import { listPublished } from "@/lib/content";
import { Container, CtaBand, ProductCard } from "@/components/marketing/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Products",
  description: "Tools and products from Torotech — SAP agents, Fiori apps and web software you can see in motion.",
};

export default async function ProductsPage() {
  const products = await listPublished("product");
  return (
    <>
      <section className="pt-16 md:pt-24">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">Products</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Things we&apos;ve built and keep building — shown in motion. Short clips and screens, not slideware.
            </p>
          </div>
          {products.length === 0 ? (
            <p className="mt-12 text-ink-soft">Nothing here yet — check back soon.</p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} item={p} />
              ))}
            </div>
          )}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
