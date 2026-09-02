"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, ExternalLink, Trash2 } from "lucide-react";
import { CONTENT_TYPES, type Content } from "@/lib/content-types";
import { contentHref } from "@/lib/content-types";
import { Button, Card, PageHeader, StatusPill, Toast, api, formatDateTime } from "./ui";

export function ContentList({ items, type }: { items: Content[]; type: string }) {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const visible = items.filter((i) => !q || i.title.toLowerCase().includes(q.toLowerCase()) || i.slug.includes(q.toLowerCase()));

  async function remove(item: Content) {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/content/${item.id}`, { method: "DELETE" });
      setToast("Deleted");
      router.refresh();
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Delete failed");
    }
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <>
      <PageHeader title="Content" lede="Services, case studies, insights and pages. Drafts are only visible here.">
        <Link href={`/admin/content/new${type !== "all" ? `?type=${type}` : ""}`}>
          <Button>
            <Plus size={16} /> New
          </Button>
        </Link>
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-line bg-paper p-0.5">
          {[{ value: "all", plural: "All" }, ...CONTENT_TYPES].map((t) => (
            <Link
              key={t.value}
              href={t.value === "all" ? "/admin/content" : `/admin/content?type=${t.value}`}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${type === t.value ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
            >
              {t.plural}
            </Link>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search titles"
          className="ml-auto w-56 rounded-lg border border-line bg-paper px-3 py-1.5 text-sm focus:border-teal focus:outline-none"
        />
      </div>

      <Card className="overflow-hidden p-0">
        {visible.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">Nothing here yet. Create your first item with the New button.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-mist text-left text-xs text-ink-soft">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Title</th>
                <th className="hidden px-4 py-2.5 font-semibold md:table-cell">Type</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="hidden px-4 py-2.5 font-semibold md:table-cell">Updated</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((item) => (
                <tr key={item.id} className="hover:bg-mist/60">
                  <td className="px-4 py-3">
                    <Link href={`/admin/content/${item.id}`} className="font-semibold text-ink hover:text-teal-deep">
                      {item.title}
                    </Link>
                    <div className="text-xs text-muted">/{item.slug}</div>
                  </td>
                  <td className="hidden px-4 py-3 text-ink-soft md:table-cell">{CONTENT_TYPES.find((t) => t.value === item.type)?.label}</td>
                  <td className="px-4 py-3">
                    <StatusPill value={item.status} />
                  </td>
                  <td className="hidden px-4 py-3 text-ink-soft md:table-cell">{formatDateTime(item.updated_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {item.status === "published" && (
                        <Link href={contentHref(item)} target="_blank" className="rounded-md p-1.5 text-ink-soft hover:bg-mist" aria-label="View on site">
                          <ExternalLink size={16} />
                        </Link>
                      )}
                      <button type="button" onClick={() => remove(item)} className="rounded-md p-1.5 text-ink-soft hover:bg-[#fdecea] hover:text-coral" aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      <Toast message={toast} />
    </>
  );
}
