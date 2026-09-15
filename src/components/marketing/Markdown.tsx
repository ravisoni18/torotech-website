import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { mediaKind } from "@/lib/content-types";

// A markdown link to a video file plays inline instead of just opening the raw file.
function A({ href, children }: { href?: string; children?: React.ReactNode }) {
  if (href && mediaKind(href) === "video") {
    return (
      <video controls playsInline preload="metadata" src={href} className="w-full rounded-[var(--radius-card)] border border-line">
        {children}
      </video>
    );
  }
  return <a href={href}>{children}</a>;
}

export function Markdown({ source, className = "" }: { source: string; className?: string }) {
  return (
    <div className={`prose-tt ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: A }}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
