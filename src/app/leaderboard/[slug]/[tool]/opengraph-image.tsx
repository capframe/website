import { ImageResponse } from "next/og";
import { loadLeaderboard } from "@/lib/leaderboard/load";
import type { Finding, Row, Severity } from "@/lib/leaderboard/types";
import {
  scoreTier,
  slugifyHandle,
  sortFindingsBySeverity,
} from "../../_components";

export const alt = "Capframe — MCP tool security report";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { slug: string; tool: string };

function slugifyTool(name: string): string {
  return name.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
}

interface ToolCard {
  toolName: string;
  toolSlug: string;
  findings: Finding[];
  row: Row;
}

async function allCards(): Promise<ToolCard[]> {
  const board = await loadLeaderboard();
  const out: ToolCard[] = [];
  for (const row of board.rows) {
    if (!row.findings?.length) continue;
    const byTool = new Map<string, Finding[]>();
    for (const f of row.findings) {
      if (!f.tool) continue;
      const list = byTool.get(f.tool) ?? [];
      list.push(f);
      byTool.set(f.tool, list);
    }
    for (const [toolName, findings] of byTool) {
      out.push({
        toolName,
        toolSlug: slugifyTool(toolName),
        findings,
        row,
      });
    }
  }
  return out;
}

async function findCard(
  slug: string,
  tool: string,
): Promise<ToolCard | null> {
  const cards = await allCards();
  return (
    cards.find(
      (c) => slugifyHandle(c.row.handle) === slug && c.toolSlug === tool,
    ) ?? null
  );
}

export default async function ToolOg({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, tool } = await params;
  const card = await findCard(slug, tool);
  if (!card) return fallback();

  const serverName =
    card.row.name ?? card.row.handle.split(/[/:]/).pop() ?? card.row.handle;
  const tier = scoreTier(card.row.score, 100);
  const tierColor =
    tier === "A"
      ? "#00f5a0"
      : tier === "B"
        ? "#22d3ee"
        : tier === "C"
          ? "#fbbf24"
          : "#f87171";
  const counts = card.findings.reduce(
    (acc, f) => {
      acc[f.severity] = (acc[f.severity] ?? 0) + 1;
      return acc;
    },
    {} as Record<Severity, number>,
  );
  const worst = sortFindingsBySeverity(card.findings)[0];
  const worstSevColor = sevToColor(worst?.severity ?? "info");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background:
            "radial-gradient(ellipse 900px 500px at 80% 100%, rgba(34,211,238,0.10), transparent 70%), #070910",
          fontFamily:
            "Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          color: "#e9ecf3",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: "2px solid rgba(0, 245, 160, 0.6)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#00f5a0",
                fontSize: 22,
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
              }}
            >
              C
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
                fontSize: 15,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#a3aab9",
              }}
            >
              {`capframe · leaderboard · tool`}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 14,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#5a6275",
            }}
          >
            {`source · ${card.row.source}`}
          </div>
        </div>

        {/* Tool name (big, mono) + parent server context */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 13,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#5a6275",
            }}
          >
            tool · on
          </div>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.0,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxHeight: 200,
            }}
          >
            {truncate(card.toolName, 36)}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#a3aab9",
            }}
          >
            {`${serverName}  ·  score `}
            <span style={{ color: tierColor, marginLeft: 6 }}>
              {String(card.row.score)}
            </span>
          </div>
        </div>

        {/* Severity strip — only chips with n>0, plus the worst-finding line */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              gap: 18,
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 24,
              letterSpacing: 2,
            }}
          >
            <SevChip n={counts.critical ?? 0} label="C" color="#f87171" />
            <SevChip n={counts.high ?? 0} label="H" color="#fbbf24" />
            <SevChip n={counts.medium ?? 0} label="M" color="#22d3ee" />
            <SevChip n={counts.low ?? 0} label="L" color="#a3aab9" />
            <div
              style={{
                display: "flex",
                marginLeft: "auto",
                color: "#5a6275",
                fontSize: 18,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              {`${card.findings.length} finding${card.findings.length === 1 ? "" : "s"}`}
            </div>
          </div>

          {worst && (
            <div
              style={{
                display: "flex",
                borderLeft: `4px solid ${worstSevColor}`,
                paddingLeft: 18,
                fontSize: 22,
                color: "#cdd1da",
                lineHeight: 1.25,
                maxHeight: 80,
                overflow: "hidden",
              }}
            >
              {truncate(worst.title, 140)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #1c2230",
            paddingTop: 14,
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            fontSize: 16,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#5a6275",
          }}
        >
          <div style={{ display: "flex" }}>find · bind · guard</div>
          <div style={{ display: "flex", color: "#00f5a0" }}>
            {`capframe.ai/leaderboard/${slug}/${tool}`.slice(0, 64)}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

function SevChip({
  n,
  label,
  color,
}: {
  n: number;
  label: string;
  color: string;
}) {
  if (n === 0) {
    return (
      <div style={{ display: "flex", color: "#3a4050" }}>{`${label}${n}`}</div>
    );
  }
  return <div style={{ display: "flex", color }}>{`${n}${label}`}</div>;
}

function sevToColor(s: Severity): string {
  switch (s) {
    case "critical":
      return "#f87171";
    case "high":
      return "#fbbf24";
    case "medium":
      return "#22d3ee";
    default:
      return "#5a6275";
  }
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}

function fallback() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#070910",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#a3aab9",
          fontSize: 36,
          fontFamily: "JetBrains Mono, ui-monospace, monospace",
        }}
      >
        capframe · tool not found
      </div>
    ),
    { ...size },
  );
}
