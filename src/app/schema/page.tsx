import { permanentRedirect } from "next/navigation";

/**
 * Multiple blog posts and external links reference `capframe.ai/schema`
 * as the canonical findings.v1 docs URL. This permanent redirect keeps
 * those links valid while the actual reference lives under /docs.
 */
export default function SchemaRedirect() {
  permanentRedirect("/docs/findings-v1");
}
