"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowDown, ArrowUp, Eye, Film, ImagePlus, Plus, Save, Trash2, Upload } from "lucide-react";
import {
  CONTENT_TYPES,
  contentHref,
  mediaKind,
  slugify,
  type Content,
  type ContentType,
  type MediaItem,
} from "@/lib/content-types";
import type { FieldDef } from "@/lib/field-types";
import { Markdown } from "@/components/marketing/Markdown";
import { Button, Card, PageHeader, Toast, api, inputCls, labelCls } from "./ui";

type Draft = {
  type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover: string;
  status: "draft" | "published";
  tags: string;
  sort_order: number;
  data: Record<string, unknown>;
};

export function Editor({ item, fields, initialType }: { item?: Content; fields: FieldDef[]; initialType?: string }) {
  const router = useRouter();
  const startType = (CONTENT_TYPES.some((t) => t.value === initialType) ? initialType : "post") as ContentType;
  const [d, setD] = useState<Draft>({
    type: item?.type ?? startType,
    title: item?.title ?? "",
    slug: item?.slug ?? "",
    excerpt: item?.excerpt ?? "",
    body: item?.body ?? "",
    cover: item?.cover ?? "",
    status: item?.status ?? "draft",
    tags: item?.tags.join(", ") ?? "",
    sort_order: item?.sort_order ?? 0,
    data: item?.data ?? {},
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(item));
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [toast, setToast] = useState<{ m: string; k: "ok" | "error" } | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const typeFields = useMemo(() => fields.filter((f) => f.entity === d.type), [fields, d.type]);

  const gallery: MediaItem[] = useMemo(
    () => (Array.isArray(d.data.gallery) ? (d.data.gallery as MediaItem[]) : []),
    [d.data.gallery],
  );

  function set<K extends keyof Draft>(k: K, v: Draft[K]) {
    setD((prev) => ({ ...prev, [k]: v }));
  }

  function setGallery(next: MediaItem[]) {
    setD((prev) => ({ ...prev, data: { ...prev.data, gallery: next } }));
  }

  function notify(m: string, k: "ok" | "error" = "ok") {
    setToast({ m, k });
    setTimeout(() => setToast(null), 2500);
  }

  async function save(status?: "draft" | "published") {
    setSaving(true);
    const payload = {
      ...d,
      status: status ?? d.status,
      slug: d.slug || slugify(d.title),
      tags: d.tags.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (item) {
        await api(`/api/admin/content/${item.id}`, { method: "PUT", json: payload });
        setD((prev) => ({ ...prev, status: payload.status, slug: payload.slug }));
        notify(payload.status === "published" ? "Published" : "Saved");
        router.refresh();
      } else {
        const res = await api<{ id: string }>(`/api/admin/content`, { method: "POST", json: payload });
        notify(payload.status === "published" ? "Published" : "Saved");
        router.replace(`/admin/content/${res.id}`);
      }
    } catch (e) {
      notify(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(file: File): Promise<{ url: string; kind: "image" | "video" }> {
    const fd = new FormData();
    fd.append("file", file);
    return api<{ url: string; kind: "image" | "video" }>(`/api/admin/upload`, { method: "POST", body: fd });
  }

  async function upload(file: File, insert: boolean) {
    try {
      const res = await uploadFile(file);
      if (insert) {
        const ta = bodyRef.current;
        const md = `\n![${file.name.replace(/\.[^.]+$/, "")}](${res.url})\n`;
        if (ta) {
          const pos = ta.selectionStart ?? d.body.length;
          set("body", d.body.slice(0, pos) + md + d.body.slice(pos));
        } else set("body", d.body + md);
      } else set("cover", res.url);
      notify("Uploaded");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Upload failed", "error");
    }
  }

  async function addToGallery(files: FileList) {
    const added: MediaItem[] = [];
    for (const file of Array.from(files)) {
      try {
        const res = await uploadFile(file);
        added.push({ url: res.url, type: res.kind ?? mediaKind(res.url), caption: "" });
      } catch (e) {
        notify(e instanceof Error ? e.message : `Upload failed: ${file.name}`, "error");
      }
    }
    if (added.length) {
      setGallery([...gallery, ...added]);
      notify(`Added ${added.length} item${added.length > 1 ? "s" : ""}`);
    }
  }

  function updateMedia(i: number, patch: Partial<MediaItem>) {
    setGallery(gallery.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  }

  function moveMedia(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= gallery.length) return;
    const next = [...gallery];
    [next[i], next[j]] = [next[j], next[i]];
    setGallery(next);
  }

  return (
    <>
      <PageHeader title={item ? "Edit content" : "New content"}>
        <Link href="/admin/content" className="mr-2 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink">
          <ArrowLeft size={16} /> All content
        </Link>
        {item && d.status === "published" && (
          <Link href={contentHref({ type: d.type, slug: d.slug })} target="_blank">
            <Button variant="ghost">
              <Eye size={16} /> View
            </Button>
          </Link>
        )}
        <Button variant="secondary" onClick={() => save("draft")} disabled={saving || !d.title}>
          <Save size={16} /> Save draft
        </Button>
        <Button onClick={() => save("published")} disabled={saving || !d.title}>
          {d.status === "published" ? "Update & publish" : "Publish"}
        </Button>
      </PageHeader>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <Card>
            <div className="grid gap-4">
              <label className={labelCls}>
                Title
                <input
                  className={`${inputCls} text-lg font-semibold`}
                  value={d.title}
                  onChange={(e) => {
                    set("title", e.target.value);
                    if (!slugTouched) set("slug", slugify(e.target.value));
                  }}
                  placeholder="A clear, specific title"
                />
              </label>
              <label className={labelCls}>
                Summary
                <textarea className={inputCls} rows={2} value={d.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="One or two sentences shown on cards and in search results." />
              </label>
            </div>
          </Card>

          <Card
            title="Body"
            aside={
              <div className="flex items-center gap-1">
                <Button variant="ghost" onClick={() => fileRef.current?.click()}>
                  <ImagePlus size={15} /> Insert image
                </Button>
                <Button variant={preview ? "secondary" : "ghost"} onClick={() => setPreview((v) => !v)}>
                  <Eye size={15} /> {preview ? "Edit" : "Preview"}
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) upload(f, true);
                    e.target.value = "";
                  }}
                />
              </div>
            }
          >
            {preview ? (
              <div className="min-h-[24rem] rounded-lg border border-line p-6">
                <Markdown source={d.body || "_Nothing to preview yet._"} />
              </div>
            ) : (
              <textarea
                ref={bodyRef}
                className={`${inputCls} min-h-[24rem] font-mono text-[13.5px] leading-relaxed`}
                value={d.body}
                onChange={(e) => set("body", e.target.value)}
                placeholder={"Write in Markdown. ## Headings, **bold**, lists, tables and code blocks all work."}
              />
            )}
          </Card>

          {d.type === "product" && (
            <Card
              title="Product gallery"
              aside={
                <>
                  <Button variant="secondary" onClick={() => galleryRef.current?.click()}>
                    <Plus size={15} /> Add media
                  </Button>
                  <input
                    ref={galleryRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.length) addToGallery(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </>
              }
            >
              {gallery.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">
                  No media yet. Add PNG/JPG/WebP images, animated GIFs, or MP4/WebM clips (≤ 50 MB). The first item is the preview.
                </p>
              ) : (
                <ul className="grid gap-3">
                  {gallery.map((m, i) => (
                    <li key={`${m.url}-${i}`} className="flex gap-3 rounded-lg border border-line p-2">
                      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-md bg-mist">
                        {m.type === "video" ? (
                          <video src={m.url} muted playsInline className="h-full w-full object-cover" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.url} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted">
                          {m.type === "video" ? <Film size={13} /> : <ImagePlus size={13} />}
                          <span className="truncate">{m.url.replace("/api/media/", "")}</span>
                          {i === 0 && <span className="rounded bg-teal-tint px-1.5 py-0.5 font-semibold text-teal-deep">Preview</span>}
                        </div>
                        <input
                          className={`${inputCls} py-1.5 text-sm`}
                          placeholder="Caption (optional)"
                          value={m.caption ?? ""}
                          onChange={(e) => updateMedia(i, { caption: e.target.value })}
                        />
                      </div>
                      <div className="flex shrink-0 flex-col items-center gap-0.5">
                        <button type="button" onClick={() => moveMedia(i, -1)} disabled={i === 0} className="rounded p-1 text-ink-soft hover:bg-mist disabled:opacity-30" aria-label="Move up">
                          <ArrowUp size={15} />
                        </button>
                        <button type="button" onClick={() => moveMedia(i, 1)} disabled={i === gallery.length - 1} className="rounded p-1 text-ink-soft hover:bg-mist disabled:opacity-30" aria-label="Move down">
                          <ArrowDown size={15} />
                        </button>
                        <button type="button" onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))} className="rounded p-1 text-ink-soft hover:bg-[#fdecea] hover:text-coral" aria-label="Remove">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}

          {typeFields.length > 0 && (
            <Card title={`${CONTENT_TYPES.find((t) => t.value === d.type)?.label} details`}>
              <div className="grid gap-4 sm:grid-cols-2">
                {typeFields.map((f) => (
                  <CustomFieldInput key={f.id} f={f} value={d.data[f.key]} onChange={(v) => set("data", { ...d.data, [f.key]: v })} />
                ))}
              </div>
              <p className="mt-4 text-xs text-muted">
                These fields are defined under <Link href="/admin/fields" className="underline">Fields</Link> — add or change them without touching code.
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <Card title="Publishing">
            <div className="grid gap-4">
              <label className={labelCls}>
                Type
                <select className={inputCls} value={d.type} onChange={(e) => set("type", e.target.value as ContentType)}>
                  {CONTENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelCls}>
                URL slug
                <input
                  className={`${inputCls} font-mono text-sm`}
                  value={d.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                />
                <span className="text-xs text-muted">{contentHref({ type: d.type, slug: d.slug || "…" })}</span>
              </label>
              <label className={labelCls}>
                Tags
                <input className={inputCls} value={d.tags} onChange={(e) => set("tags", e.target.value)} placeholder="Comma-separated" />
              </label>
              <label className={labelCls}>
                Sort order
                <input type="number" className={inputCls} value={d.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} />
                <span className="text-xs text-muted">Lower numbers appear first in lists.</span>
              </label>
              <div className="text-sm text-ink-soft">
                Status: <strong className="text-ink">{d.status}</strong>
              </div>
            </div>
          </Card>

          <Card title={d.type === "product" ? "Preview media" : "Cover image"}>
            {d.cover ? (
              mediaKind(d.cover) === "video" ? (
                <video src={d.cover} muted playsInline loop autoPlay className="mb-3 aspect-[16/9] w-full rounded-lg object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.cover} alt="" className="mb-3 aspect-[16/9] w-full rounded-lg object-cover" />
              )
            ) : (
              <div className="mb-3 flex aspect-[16/9] items-center justify-center rounded-lg bg-mist text-sm text-muted">
                {d.type === "product" ? "Falls back to the first gallery item" : "No cover yet"}
              </div>
            )}
            <div className="flex gap-2">
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink hover:border-ink">
                <Upload size={15} /> Upload
                <input
                  type="file"
                  accept={d.type === "product" ? "image/*,video/mp4,video/webm,video/quicktime" : "image/*"}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) upload(f, false);
                    e.target.value = "";
                  }}
                />
              </label>
              {d.cover && (
                <Button variant="ghost" onClick={() => set("cover", "")}>
                  Remove
                </Button>
              )}
            </div>
            <input className={`${inputCls} mt-3 font-mono text-xs`} value={d.cover} onChange={(e) => set("cover", e.target.value)} placeholder="or paste a URL" />
          </Card>
        </div>
      </div>
      <Toast message={toast?.m ?? null} kind={toast?.k} />
    </>
  );
}

function CustomFieldInput({ f, value, onChange }: { f: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  if (f.type === "boolean") {
    return (
      <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[var(--teal)]" />
        {f.label}
      </label>
    );
  }
  if (f.type === "select") {
    return (
      <label className={labelCls}>
        {f.label}
        <select className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {f.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
    );
  }
  if (f.type === "textarea" || f.type === "list") {
    const text = Array.isArray(value) ? value.join("\n") : String(value ?? "");
    return (
      <label className={`${labelCls} sm:col-span-2`}>
        {f.label}
        <textarea className={inputCls} rows={3} value={text} onChange={(e) => onChange(f.type === "list" ? e.target.value.split("\n") : e.target.value)} />
        {f.type === "list" && <span className="text-xs text-muted">One item per line.</span>}
      </label>
    );
  }
  const type = f.type === "number" ? "number" : f.type === "url" ? "url" : f.type === "date" ? "date" : "text";
  return (
    <label className={labelCls}>
      {f.label}
      <input type={type} className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
