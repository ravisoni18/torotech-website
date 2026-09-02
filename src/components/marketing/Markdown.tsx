import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ source, className = "" }: { source: string; className?: string }) {
  return (
    <div className={`prose-tt ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </div>
  );
}
