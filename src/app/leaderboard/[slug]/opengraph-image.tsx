import { ImageResponse } from "next/og";
import { loadLeaderboard } from "@/lib/leaderboard/load";
import type { Row } from "@/lib/leaderboard/types";
import { scoreTier, slugifyHandle, sortFindingsBySeverity } from "../_components";

export const alt = "Capframe — MCP server security report";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { slug: string };

async function findRow(slug: string): Promise<Row | null> {
  const board = await loadLeaderboard();
  return board.rows.find((r) => slugifyHandle(r.handle) === slug) ?? null;
}

export default async function ServerOg({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const row = await findRow(slug);
  if (!row) {
    return fallback();
  }
  const name = row.name ?? row.handle.split(/[/:]/).pop() ?? row.handle;
  const tier = scoreTier(row.score, 100);
  const tierColor =
    tier === "A"
      ? "#00f5a0"
      : tier === "B"
        ? "#22d3ee"
        : tier === "C"
          ? "#fbbf24"
          : "#f87171";
  const findingsCount =
    row.counts.critical +
    row.counts.high +
    row.counts.medium +
    row.counts.low +
    row.counts.info;
  const worst = sortFindingsBySeverity(row.findings ?? [])[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background:
            "radial-gradient(ellipse 900px 500px at 80% 100%, rgba(0,245,160,0.10), transparent 70%), #070910",
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
                width: 44,
                height: 44,
                border: "2px solid rgba(0, 245, 160, 0.6)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#00f5a0",
                fontSize: 26,
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
              }}
            >
              C
            </div>
            <div
              style={{
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
                fontSize: 16,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#a3aab9",
              }}
            >
              capframe · leaderboard
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
            {`source · ${row.source}`}
          </div>
        </div>

        {/* Main: name + score side-by-side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 60,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: 76,
                lineHeight: 1.0,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
                fontSize: 22,
                color: "#a3aab9",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 700,
              }}
            >
              {row.handle}
            </div>
          </div>

          {/* Score badge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: `4px solid ${tierColor}`,
              borderRadius: 18,
              padding: "26px 36px",
              minWidth: 220,
            }}
          >
            <div
              style={{
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
                fontSize: 26,
                letterSpacing: 4,
                color: tierColor,
              }}
            >
              {tier}
            </div>
            <div
              style={{
                fontSize: 140,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: tierColor,
                lineHeight: 1.0,
                marginTop: 4,
              }}
            >
              {row.score}
            </div>
            <div
              style={{
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
                fontSize: 16,
                letterSpacing: 3,
                color: "#5a6275",
                marginTop: 6,
              }}
            >
              / 100
            </div>
          </div>
        </div>

        {/* Findings row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
          }}
        >
          {findingsCount === 0 ? (
            <div
              style={{
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
                fontSize: 22,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#00f5a0",
              }}
            >
              — clean — no findings
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: 18,
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
                fontSize: 24,
                letterSpacing: 2,
              }}
            >
              <SevChip n={row.counts.critical} label="C" color="#f87171" />
              <SevChip n={row.counts.high} label="H" color="#fbbf24" />
              <SevChip n={row.counts.medium} label="M" color="#22d3ee" />
              <SevChip n={row.counts.low} label="L" color="#a3aab9" />
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 18,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#5a6275",
            }}
          >
            {`${row.tool_count ?? "—"} tools`}
          </div>
        </div>

        {/* Worst-finding callout, if any */}
        {worst && (
          <div
            style={{
              display: "flex",
              borderLeft: `4px solid ${tierColor}`,
              paddingLeft: 18,
              fontSize: 24,
              color: "#cdd1da",
              lineHeight: 1.25,
              maxHeight: 90,
              overflow: "hidden",
            }}
          >
            {truncate(worst.title, 140)}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #1c2230",
            paddingTop: 18,
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            fontSize: 18,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#5a6275",
          }}
        >
          <div>find · bind · guard</div>
          <div style={{ color: "#00f5a0" }}>capframe.ai/leaderboard</div>
        </div>
      </div>
    ),
    { ...size }
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
    return <div style={{ display: "flex", color: "#3a4050" }}>{`${label}${n}`}</div>;
  }
  return <div style={{ display: "flex", color }}>{`${n}${label}`}</div>;
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
        capframe · server not found
      </div>
    ),
    { ...size }
  );
}
