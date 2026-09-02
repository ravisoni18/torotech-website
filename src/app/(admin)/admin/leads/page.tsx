import { listLeads } from "@/lib/leads";
import { listFields } from "@/lib/fields";
import { LeadsInbox } from "@/components/admin/LeadsInbox";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const [leads, fields] = await Promise.all([listLeads(), listFields("lead")]);
  return <LeadsInbox initial={leads} fields={fields} />;
}
