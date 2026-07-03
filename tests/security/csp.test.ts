import { describe, expect, it } from "vitest";
import { buildContentSecurityPolicy } from "@/lib/security/csp";

function directive(csp: string, name: string): string {
  return csp.split(";").find((part) => part.trim().startsWith(name)) ?? "";
}

describe("buildContentSecurityPolicy", () => {
  it("uses a nonce and strict-dynamic in production", () => {
    const csp = buildContentSecurityPolicy("abc123", false);
    expect(directive(csp, "script-src")).toContain("'nonce-abc123'");
    expect(directive(csp, "script-src")).toContain("'strict-dynamic'");
    expect(csp).toContain("upgrade-insecure-requests");
  });

  it("never allows unsafe-inline scripts in production", () => {
    const csp = buildContentSecurityPolicy("abc123", false);
    expect(directive(csp, "script-src")).not.toContain("unsafe-inline");
  });

  it("relaxes script-src for local development only", () => {
    const csp = buildContentSecurityPolicy("abc123", true);
    expect(directive(csp, "script-src")).toContain("'unsafe-eval'");
    expect(csp).not.toContain("upgrade-insecure-requests");
  });

  it("denies framing and object embedding", () => {
    const csp = buildContentSecurityPolicy("abc123", false);
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
  });
});
