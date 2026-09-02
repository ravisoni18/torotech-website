"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, ExternalLink, Trash2, Film, Image as ImageIcon } from "lucide-react";
import { mediaKind, productGallery, type Content } from "@/lib/content-types";
import { Button, Card, PageHeader, StatusPill, Toast, api, formatDateTime } from "./ui";

export function ProductAdminList({ items }: { items: Content[] }) {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

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
      <PageHeader title="Products" lede="Showcase items with images, GIFs and short videos. Drafts stay hidden until published.">
        <Link href="/admin/content/new?type=product">
          <Button>
            <Plus size={16} /> New product
          </Button>
        </Link>
      </PageHeader>

      {items.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm text-muted">
            No products yet. Create one with <strong>New product</strong> — add a title, then upload images or clips to the gallery.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const gallery = productGallery(item.data);
            const hero = item.cover ? { url: item.cover, type: mediaKind(item.cover) } : gallery[0];
            const videos = gallery.filter((m) => m.type === "video").length;
            const images = gallery.length - videos;
            return (
              <Card key={item.id} className="flex flex-col overflow-hidden p-0">
                <Link href={`/admin/content/${item.id}`} className="block aspect-[16/10] overflow-hidden bg-mist">
                  {hero ? (
                    hero.type === "video" ? (
                      <video src={hero.url} muted playsInline className="h-full w-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={hero.url} alt="" className="h-full w-full object-cover" />
                    )
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted">No media</div>
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/admin/content/${item.id}`} className="font-semibold text-ink hover:text-teal-deep">
                      {item.title}
                    </Link>
                    <StatusPill value={item.status} />
                  </div>
                  <div className="text-xs text-muted">/{item.slug}</div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-ink-soft">
                    <span className="inline-flex items-center gap-1">
                      <ImageIcon size={13} /> {images}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Film size={13} /> {videos}
                    </span>
                    <span className="ml-auto">{formatDateTime(item.updated_at)}</span>
                  </div>
                  <div className="mt-2 flex gap-1 border-t border-line pt-2">
                    <Link href={`/admin/content/${item.id}`} className="rounded-md px-2 py-1 text-xs font-semibold text-ink-soft hover:bg-mist hover:text-ink">
                      Edit
                    </Link>
                    {item.status === "published" && (
                      <Link
                        href={`/products/${item.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-ink-soft hover:bg-mist hover:text-ink"
                      >
                        View <ExternalLink size={12} />
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(item)}
                      className="ml-auto rounded-md p-1.5 text-ink-soft hover:bg-[#fdecea] hover:text-coral"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <Toast message={toast} />
    </>
  );
}
