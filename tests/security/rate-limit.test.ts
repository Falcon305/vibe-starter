import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(path.resolve("lib/rate-limit.ts"), "utf8");
const isBaseImplementation = !source.includes("@upstash");

describe.skipIf(!isBaseImplementation)("rateLimit", () => {
  it("allows requests up to the limit and blocks the next", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const key = "limit-test";
    expect(await rateLimit(key, 2, 1000)).toBe(true);
    expect(await rateLimit(key, 2, 1000)).toBe(true);
    expect(await rateLimit(key, 2, 1000)).toBe(false);
  });

  it("resets after the window elapses", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const key = "reset-test";
    expect(await rateLimit(key, 1, 1)).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 5));
    expect(await rateLimit(key, 1, 1)).toBe(true);
  });
});

describe.skipIf(!isBaseImplementation)("clientIp", () => {
  it("takes the first x-forwarded-for hop", async () => {
    const { clientIp } = await import("@/lib/rate-limit");
    expect(clientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe("1.2.3.4");
  });

  it("falls back to unknown", async () => {
    const { clientIp } = await import("@/lib/rate-limit");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
