import { listFields } from "@/lib/fields";
import { Editor } from "@/components/admin/Editor";

export const dynamic = "force-dynamic";

export default async function NewContentPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const fields = await listFields();
  return <Editor fields={fields} initialType={type} />;
}
