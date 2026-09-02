import { listFields } from "@/lib/fields";
import { FieldsManager } from "@/components/admin/FieldsManager";

export const dynamic = "force-dynamic";

export default async function FieldsPage() {
  const fields = await listFields();
  return <FieldsManager initial={fields} />;
}
