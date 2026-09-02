import { notFound } from "next/navigation";
import { getById } from "@/lib/content";
import { listFields } from "@/lib/fields";
import { Editor } from "@/components/admin/Editor";

export const dynamic = "force-dynamic";

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, fields] = await Promise.all([getById(id), listFields()]);
  if (!item) notFound();
  return <Editor fields={fields} item={item} />;
}
