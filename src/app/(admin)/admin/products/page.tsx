import { listAll } from "@/lib/content";
import { ProductAdminList } from "@/components/admin/ProductAdminList";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const items = await listAll("product");
  return <ProductAdminList items={items} />;
}
