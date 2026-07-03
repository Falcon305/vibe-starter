import { expect, test } from "@playwright/test";

function directive(csp: string, name: string): string {
  return csp.split(";").find((part) => part.trim().startsWith(name)) ?? "";
}

test("serves hardened security headers", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();

  expect(headers["strict-transport-security"]).toBeTruthy();
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBeTruthy();
});

test("uses a nonce-based CSP with no unsafe-inline scripts", async ({ request }) => {
  const response = await request.get("/");
  const csp = response.headers()["content-security-policy"] ?? "";
  const scriptSrc = directive(csp, "script-src");

  expect(scriptSrc).toContain("'strict-dynamic'");
  expect(scriptSrc).not.toContain("unsafe-inline");
  expect(csp).toContain("frame-ancestors 'none'");
});

test("health endpoint returns ok", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
});
