import type { Metadata } from "next";
import { listPublished } from "@/lib/content";
import { Container, CtaBand, PostCard } from "@/components/marketing/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Insights", description: "Practical writing on SAP agents, CDS, BTP and web architecture." };

export default async function BlogPage() {
  const posts = await listPublished("post", 100);
  return (
    <>
      <section className="pt-16 md:pt-24">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">Insights</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Short, practical notes from real builds. No trend pieces.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} item={p} />
            ))}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
