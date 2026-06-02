import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Capframe — Capability security for AI agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(ellipse 900px 500px at 20% 0%, rgba(0,245,160,0.18), transparent 70%), #070910",
          fontFamily:
            "Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          color: "#e9ecf3",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              border: "2px solid rgba(0, 245, 160, 0.6)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#00f5a0",
              fontSize: 32,
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
            }}
          >
            C
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#a3aab9",
            }}
          >
            capframe
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 100,
              lineHeight: 1.02,
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            Capability security
            <br />
            for <span style={{ color: "#00f5a0" }}>AI agents</span>.
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 28,
              color: "#a3aab9",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Three MCP-native modules. Audit-mapped to OWASP LLM, NIST AI
            RMF, MITRE ATLAS.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #1c2230",
            paddingTop: 28,
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#5a6275",
          }}
        >
          <div>find · bind · guard</div>
          <div style={{ color: "#00f5a0" }}>capframe.ai</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
