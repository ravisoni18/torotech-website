"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Maximize2, X } from "lucide-react";
import { MediaFrame, Tag } from "./ui";
import { Markdown } from "./Markdown";
import { productGallery, type Content, type MediaItem } from "@/lib/content-types";

type ZoomTarget = MediaItem | { url: string };

function splitTech(tech: string) {
  return tech
    .split(/[,+]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function Lightbox({ item, onClose }: { item: ZoomTarget; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4" onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        aria-label="Close"
      >
        <X size={22} />
      </button>
      <div onClick={(e) => e.stopPropagation()}>
        <MediaFrame item={item} priority className="max-h-[90vh] max-w-[90vw] object-contain" />
      </div>
    </div>
  );
}

function ZoomableMedia({ item, className, onZoom }: { item: ZoomTarget; className: string; onZoom: () => void }) {
  return (
    <button type="button" onClick={onZoom} className="group relative block w-full cursor-zoom-in" aria-label="View larger">
      <MediaFrame item={item} className={className} />
      <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-opacity group-hover:bg-ink/30 group-hover:opacity-100">
        <Maximize2 size={22} className="text-white" />
      </span>
    </button>
  );
}

function ProjectModal({ item, onClose }: { item: Content; onClose: () => void }) {
  const [zoomed, setZoomed] = useState<ZoomTarget | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (zoomed ? setZoomed(null) : onClose());
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, zoomed]);

  const client = typeof item.data.client === "string" ? item.data.client : "";
  const tech = typeof item.data.tech === "string" ? item.data.tech : "";
  const duration = typeof item.data.duration === "string" ? item.data.duration : "";
  const link = typeof item.data.link === "string" ? item.data.link : "";
  const media = productGallery(item.data);
  const hero = item.cover ? { url: item.cover } : media[0];
  const rest = item.cover ? media : media.slice(1);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 py-10 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-[var(--radius-card)] border border-line bg-paper shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <h3 className="text-xl font-bold text-ink">{item.title}</h3>
            <p className="mt-1 text-sm text-muted">{[client, tech, duration].filter(Boolean).join(" · ")}</p>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 rounded-full p-1.5 text-ink-soft hover:bg-mist hover:text-ink" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-5">
          {hero && (
            <div className="mb-5 overflow-hidden rounded-[var(--radius-card)] border border-line bg-mist">
              <ZoomableMedia item={hero} className="h-auto w-full" onZoom={() => setZoomed(hero)} />
            </div>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-teal-deep"
            >
              Visit <ExternalLink size={14} />
            </a>
          )}
          <Markdown source={item.body || item.excerpt || ""} />
          {rest.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {rest.map((m, i) => (
                <div key={`${m.url}-${i}`} className="overflow-hidden rounded-lg border border-line bg-mist">
                  <ZoomableMedia item={m} className="h-auto w-full" onZoom={() => setZoomed(m)} />
                </div>
              ))}
            </div>
          )}
          {tech && (
            <div className="mt-5 flex flex-wrap gap-2">
              {splitTech(tech).map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          )}
        </div>
      </div>
      {zoomed && <Lightbox item={zoomed} onClose={() => setZoomed(null)} />}
    </div>
  );
}

export function CvProjectGrid({ projects }: { projects: Content[] }) {
  const [selected, setSelected] = useState<Content | null>(null);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((p) => {
          const client = typeof p.data.client === "string" ? p.data.client : "";
          const tech = typeof p.data.tech === "string" ? p.data.tech : "";
          const duration = typeof p.data.duration === "string" ? p.data.duration : "";
          const media = productGallery(p.data);
          const hero = p.cover ? { url: p.cover } : media[0];
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper text-left transition-colors hover:border-teal"
            >
              {hero && (
                <div className="cv-no-print relative aspect-[16/10] overflow-hidden bg-mist">
                  <MediaFrame item={hero} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-[15px] font-bold text-ink group-hover:text-teal-deep">{p.title}</h3>
                <p className="text-xs text-muted">{[client, tech, duration].filter(Boolean).join(" · ")}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{p.excerpt}</p>
              </div>
            </button>
          );
        })}
      </div>
      {selected && <ProjectModal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
