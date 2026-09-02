import Link from "next/link";
import { Container } from "@/components/marketing/ui";

export default function NotFound() {
  return (
    <section className="pt-24">
      <Container className="max-w-xl">
        <h1 className="text-4xl font-extrabold text-ink">That page isn&apos;t here.</h1>
        <p className="mt-4 text-lg text-ink-soft">It may have been unpublished, or the link is out of date.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white">
          Back to the homepage
        </Link>
      </Container>
    </section>
  );
}
