import { listAll, CONTENT_TYPES, type ContentType } from "@/lib/content";
import { ContentList } from "@/components/admin/ContentList";

export const dynamic = "force-dynamic";

export default async function ContentPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const valid = CONTENT_TYPES.some((t) => t.value === type) ? (type as ContentType) : undefined;
  const items = await listAll(valid);
  return <ContentList items={items} type={valid ?? "all"} />;
}
