"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Globe, Brain, Braces, MessageSquare, Database, X, Play, Trophy, Target, RotateCcw } from "lucide-react";

type NodeType = "Webhook" | "AI Agent" | "JSON Filter" | "Slack Alert" | "Postgres DB";
type ColorKey = "emerald" | "purple" | "blue" | "rose" | "amber";

type CanvasNode = { id: string; type: NodeType; color: ColorKey };
type Connection = { from: string; to: string };
type Line = { id: string; x1: number; y1: number; x2: number; y2: number };

const NODE_DEFS: { type: NodeType; icon: typeof Globe; color: ColorKey; desc: string }[] = [
  { type: "Webhook", icon: Globe, color: "emerald", desc: "Listens for incoming HTTP POST" },
  { type: "AI Agent", icon: Brain, color: "purple", desc: "Processes text with LLM logic" },
  { type: "JSON Filter", icon: Braces, color: "blue", desc: "Transforms payload properties" },
  { type: "Slack Alert", icon: MessageSquare, color: "rose", desc: "Sends notification to channel" },
  { type: "Postgres DB", icon: Database, color: "amber", desc: "Inserts data into database" },
];

const COLOR_CLASSES: Record<ColorKey, { border: string; bg: string; text: string; stroke: string }> = {
  emerald: { border: "border-emerald-500/50", bg: "bg-emerald-500/10", text: "text-emerald-400", stroke: "#34d399" },
  purple: { border: "border-purple-500/50", bg: "bg-purple-500/10", text: "text-purple-400", stroke: "#a78bfa" },
  blue: { border: "border-blue-500/50", bg: "bg-blue-500/10", text: "text-blue-400", stroke: "#60a5fa" },
  rose: { border: "border-rose-500/50", bg: "bg-rose-500/10", text: "text-rose-400", stroke: "#fb7185" },
  amber: { border: "border-amber-500/50", bg: "bg-amber-500/10", text: "text-amber-400", stroke: "#fbbf24" },
};

const LEVELS = [
  { title: "Webhook to AI & Slack", desc: "Add a Webhook, a Toro AI Agent and a Slack Alert, then join them.", required: ["Webhook", "AI Agent", "Slack Alert"] as NodeType[], points: 100 },
  { title: "Data Enrichment Pipeline", desc: "Add a Webhook, a JSON Filter and a Postgres DB, then join them.", required: ["Webhook", "JSON Filter", "Postgres DB"] as NodeType[], points: 250 },
  { title: "Enterprise Autonomous Bot", desc: "Add all five node types and join them into one pipeline.", required: ["Webhook", "AI Agent", "JSON Filter", "Postgres DB", "Slack Alert"] as NodeType[], points: 500 },
];

let idCounter = 0;
const nextId = () => `node_${++idCounter}`;

const DEFAULT_NODES: NodeType[] = ["Webhook", "AI Agent", "Slack Alert"];
const initialNodes = (): CanvasNode[] =>
  DEFAULT_NODES.map((type) => ({ id: nextId(), type, color: NODE_DEFS.find((d) => d.type === type)!.color }));

export function N8nGame() {
  const [nodes, setNodes] = useState<CanvasNode[]>(initialNodes);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "fail"; text: string }>({ kind: "idle", text: "Ready to execute workflow…" });
  const [logs, setLogs] = useState<string[]>(["[System] Canvas ready. Add nodes below, then tap two to join them."]);
  const [lines, setLines] = useState<Line[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLDivElement>());

  const log = useCallback((text: string) => {
    setLogs((l) => [...l.slice(-30), `[${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}] ${text}`]);
  }, []);

  const seed = useCallback((types: NodeType[]) => {
    setNodes(
      types.map((type) => ({
        id: nextId(),
        type,
        color: NODE_DEFS.find((d) => d.type === type)!.color,
      })),
    );
    setConnections([]);
    setSelected(null);
  }, []);

  const recomputeLines = useCallback(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvasRect = canvasEl.getBoundingClientRect();
    const next: Line[] = [];
    for (const conn of connections) {
      const a = nodeRefs.current.get(conn.from);
      const b = nodeRefs.current.get(conn.to);
      if (!a || !b) continue;
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      next.push({
        id: `${conn.from}-${conn.to}`,
        x1: ra.left + ra.width / 2 - canvasRect.left,
        y1: ra.top + ra.height / 2 - canvasRect.top,
        x2: rb.left + rb.width / 2 - canvasRect.left,
        y2: rb.top + rb.height / 2 - canvasRect.top,
      });
    }
    setLines(next);
  }, [connections]);

  useEffect(() => {
    recomputeLines();
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => recomputeLines());
    ro.observe(el);
    window.addEventListener("resize", recomputeLines);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recomputeLines);
    };
  }, [recomputeLines, nodes]);

  function addNode(type: NodeType) {
    const def = NODE_DEFS.find((d) => d.type === type)!;
    const node: CanvasNode = { id: nextId(), type, color: def.color };
    setNodes((n) => [...n, node]);
    log(`Added "${type}" to the canvas.`);
  }

  function removeNode(id: string) {
    setNodes((n) => n.filter((x) => x.id !== id));
    setConnections((c) => c.filter((x) => x.from !== id && x.to !== id));
    setSelected((s) => (s === id ? null : s));
  }

  function tapNode(id: string) {
    if (!selected) {
      setSelected(id);
      return;
    }
    if (selected === id) {
      setSelected(null);
      return;
    }
    const exists = connections.some((c) => (c.from === selected && c.to === id) || (c.from === id && c.to === selected));
    if (!exists) {
      setConnections((c) => [...c, { from: selected, to: id }]);
      log(`Joined ${nodes.find((n) => n.id === selected)?.type} → ${nodes.find((n) => n.id === id)?.type}.`);
    }
    setSelected(null);
  }

  function execute() {
    const lvl = LEVELS[level];
    const present = new Set(nodes.map((n) => n.type));
    const hasAll = lvl.required.every((t) => present.has(t));
    const hasLinks = connections.length > 0;
    log("Triggering workflow execution…");

    setTimeout(() => {
      if (hasAll && hasLinks) {
        setScore((s) => s + lvl.points);
        setStatus({ kind: "ok", text: "Execution successful (200 OK)" });
        log(`Workflow executed successfully — score +${lvl.points}.`);
        if (level < LEVELS.length - 1) {
          setTimeout(() => {
            setLevel((l) => l + 1);
            log(`Advanced to mission ${level + 2}.`);
          }, 1200);
        } else {
          log("All missions complete. Nice work.");
        }
      } else {
        setStatus({ kind: "fail", text: "Missing nodes or joins" });
        log("Validation failed — add the required nodes and join at least two of them.");
      }
    }, 500);
  }

  function resetCanvas() {
    seed(["Webhook"]);
    setStatus({ kind: "idle", text: "Ready to execute workflow…" });
    log("Canvas cleared.");
  }

  const lvl = LEVELS[level];

  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-[#0f1117] text-slate-200">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-white/10 bg-[#161920] px-4 py-3 sm:px-5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-orange-500 to-amber-400 text-white">
          <Play size={14} fill="currentColor" />
        </span>
        <span className="text-sm font-bold text-white">Toro Automator</span>
        <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-semibold text-orange-400">n8n workflow game</span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs">
          <Trophy size={12} className="text-amber-400" /> Score: <strong className="text-white">{score}</strong>
        </span>
        <button
          type="button"
          onClick={execute}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-opacity hover:opacity-90"
        >
          <Play size={12} fill="currentColor" /> Execute
        </button>
      </div>

      {/* Mission */}
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/10 bg-[#12141a] px-4 py-3 text-xs sm:px-5">
        <div className="flex items-start gap-2">
          <Target size={13} className="mt-0.5 shrink-0 text-orange-400" />
          <div>
            <span className="font-bold text-white">
              Mission {level + 1}/{LEVELS.length}: {lvl.title}
            </span>
            <p className="mt-0.5 text-slate-400">{lvl.desc}</p>
          </div>
        </div>
        <button type="button" onClick={resetCanvas} className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-slate-300 hover:bg-white/10">
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      {/* Toolbox */}
      <div className="flex gap-2 overflow-x-auto border-b border-white/10 bg-[#12141a] px-4 py-3 sm:px-5">
        {NODE_DEFS.map((def) => {
          const c = COLOR_CLASSES[def.color];
          return (
            <button
              key={def.type}
              type="button"
              onClick={() => addNode(def.type)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border ${c.border} ${c.bg} px-3 py-2 text-left transition-transform hover:scale-[1.03]`}
            >
              <def.icon size={14} className={c.text} />
              <span className="text-xs font-semibold text-white">{def.type}</span>
            </button>
          );
        })}
      </div>

      {/* Canvas */}
      <div ref={canvasRef} className="relative min-h-[260px] p-4 sm:min-h-[300px] sm:p-5">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          {lines.map((l) => (
            <path
              key={l.id}
              d={`M ${l.x1} ${l.y1} C ${l.x1 + (l.x2 - l.x1) / 3} ${l.y1}, ${l.x2 - (l.x2 - l.x1) / 3} ${l.y2}, ${l.x2} ${l.y2}`}
              stroke="#ff6d5a"
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className="relative z-10 flex flex-wrap gap-3">
          {nodes.map((node) => {
            const def = NODE_DEFS.find((d) => d.type === node.type)!;
            const c = COLOR_CLASSES[node.color];
            const isSelected = selected === node.id;
            return (
              <div
                key={node.id}
                ref={(el) => {
                  if (el) nodeRefs.current.set(node.id, el);
                  else nodeRefs.current.delete(node.id);
                }}
                onClick={() => tapNode(node.id)}
                role="button"
                tabIndex={0}
                className={`w-[46%] min-w-[130px] max-w-[220px] cursor-pointer rounded-xl border-2 bg-[#1a1d24] p-3 transition-all sm:w-[160px] ${
                  isSelected ? "border-orange-400 shadow-lg shadow-orange-500/20" : `${c.border} border-opacity-40`
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${c.bg} ${c.text}`}>
                    <def.icon size={13} />
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNode(node.id);
                    }}
                    className="text-slate-500 hover:text-rose-400"
                    aria-label="Remove node"
                  >
                    <X size={13} />
                  </button>
                </div>
                <p className="mt-2 text-xs font-bold text-white">{node.type}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{isSelected ? "Tap another to join" : "Tap to select"}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Console */}
      <div className="border-t border-white/10 bg-[#161920] px-4 py-3 sm:px-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Execution console
          </span>
          <span className={status.kind === "ok" ? "font-semibold text-emerald-400" : status.kind === "fail" ? "font-semibold text-rose-400" : "text-slate-400"}>
            {status.text}
          </span>
        </div>
        <div className="max-h-24 space-y-1 overflow-y-auto font-mono text-[11px] text-slate-400">
          {logs.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
