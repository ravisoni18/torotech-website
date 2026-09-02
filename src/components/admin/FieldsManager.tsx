"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil } from "lucide-react";
import { FIELD_ENTITIES, FIELD_TYPES, type FieldDef, type FieldEntity, type FieldType } from "@/lib/field-types";
import { Button, Card, PageHeader, Toast, api, inputCls, labelCls } from "./ui";

type Draft = Omit<FieldDef, "id" | "options"> & { options: string };

const blank = (entity: FieldEntity): Draft => ({ entity, key: "", label: "", type: "text", options: "", required: false, sort_order: 0 });

export function FieldsManager({ initial }: { initial: FieldDef[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<{ id: string | null; d: Draft } | null>(null);
  const [toast, setToast] = useState<{ m: string; k: "ok" | "error" } | null>(null);

  function notify(m: string, k: "ok" | "error" = "ok") {
    setToast({ m, k });
    setTimeout(() => setToast(null), 2500);
  }

  async function save() {
    if (!editing) return;
    const payload = {
      ...editing.d,
      key: editing.d.key || editing.d.label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""),
      options: editing.d.options.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing.id) await api(`/api/admin/fields/${editing.id}`, { method: "PUT", json: payload });
      else await api(`/api/admin/fields`, { method: "POST", json: payload });
      notify("Field saved");
      setEditing(null);
      router.refresh();
    } catch (e) {
      notify(e instanceof Error ? e.message : "Save failed", "error");
    }
  }

  async function remove(f: FieldDef) {
    if (!window.confirm(`Remove the "${f.label}" field? Existing values stay in the data but stop showing in forms.`)) return;
    await api(`/api/admin/fields/${f.id}`, { method: "DELETE" });
    notify("Field removed");
    router.refresh();
  }

  return (
    <>
      <PageHeader
        title="Fields"
        lede="Add structured fields to any content type or to the contact form — no code, no migration. Values live in a JSON column and are queryable in DuckDB."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {FIELD_ENTITIES.map((ent) => {
            const rows = initial.filter((f) => f.entity === ent.value);
            return (
              <Card
                key={ent.value}
                title={ent.label}
                aside={
                  <Button variant="ghost" onClick={() => setEditing({ id: null, d: blank(ent.value) })}>
                    <Plus size={15} /> Add field
                  </Button>
                }
              >
                {rows.length === 0 ? (
                  <p className="text-sm text-muted">No custom fields yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs text-ink-soft">
                      <tr>
                        <th className="py-1.5 font-semibold">Label</th>
                        <th className="py-1.5 font-semibold">Key</th>
                        <th className="py-1.5 font-semibold">Type</th>
                        <th className="py-1.5" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {rows.map((f) => (
                        <tr key={f.id}>
                          <td className="py-2 font-medium text-ink">
                            {f.label}
                            {f.required && <span className="ml-1 text-coral">*</span>}
                          </td>
                          <td className="py-2 font-mono text-xs text-ink-soft">{f.key}</td>
                          <td className="py-2 text-ink-soft">
                            {f.type}
                            {f.type === "select" && <span className="text-xs text-muted"> ({f.options.length})</span>}
                          </td>
                          <td className="py-2 text-right">
                            <button
                              type="button"
                              className="rounded-md p-1.5 text-ink-soft hover:bg-mist"
                              aria-label="Edit"
                              onClick={() => setEditing({ id: f.id, d: { ...f, options: f.options.join("\n") } })}
                            >
                              <Pencil size={15} />
                            </button>
                            <button type="button" className="rounded-md p-1.5 text-ink-soft hover:bg-[#fdecea] hover:text-coral" aria-label="Delete" onClick={() => remove(f)}>
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
            );
          })}
        </div>

        <div>
          <Card title={editing ? (editing.id ? "Edit field" : "New field") : "Field editor"} className="sticky top-6">
            {!editing ? (
              <p className="text-sm text-muted">Choose “Add field” next to a content type, or edit an existing one.</p>
            ) : (
              <div className="grid gap-4">
                <label className={labelCls}>
                  Applies to
                  <select className={inputCls} value={editing.d.entity} onChange={(e) => setEditing({ ...editing, d: { ...editing.d, entity: e.target.value as FieldEntity } })}>
                    {FIELD_ENTITIES.map((e) => (
                      <option key={e.value} value={e.value}>
                        {e.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={labelCls}>
                  Label
                  <input className={inputCls} value={editing.d.label} onChange={(e) => setEditing({ ...editing, d: { ...editing.d, label: e.target.value } })} placeholder="Shown in the form" />
                </label>
                <label className={labelCls}>
                  Key
                  <input
                    className={`${inputCls} font-mono text-sm`}
                    value={editing.d.key}
                    onChange={(e) => setEditing({ ...editing, d: { ...editing.d, key: e.target.value } })}
                    placeholder="snake_case (auto from label)"
                    disabled={Boolean(editing.id)}
                  />
                </label>
                <label className={labelCls}>
                  Type
                  <select className={inputCls} value={editing.d.type} onChange={(e) => setEditing({ ...editing, d: { ...editing.d, type: e.target.value as FieldType } })}>
                    {FIELD_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                {editing.d.type === "select" && (
                  <label className={labelCls}>
                    Options (one per line)
                    <textarea className={inputCls} rows={4} value={editing.d.options} onChange={(e) => setEditing({ ...editing, d: { ...editing.d, options: e.target.value } })} />
                  </label>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-ink">
                    <input type="checkbox" checked={editing.d.required} onChange={(e) => setEditing({ ...editing, d: { ...editing.d, required: e.target.checked } })} className="h-4 w-4 accent-[var(--teal)]" />
                    Required
                  </label>
                  <label className={labelCls}>
                    Order
                    <input type="number" className={inputCls} value={editing.d.sort_order} onChange={(e) => setEditing({ ...editing, d: { ...editing.d, sort_order: Number(e.target.value) } })} />
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={save} disabled={!editing.d.label}>
                    Save field
                  </Button>
                  <Button variant="ghost" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      <Toast message={toast?.m ?? null} kind={toast?.k} />
    </>
  );
}
