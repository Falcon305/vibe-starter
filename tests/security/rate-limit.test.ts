import { describe, expect, it } from "vitest";
import { clientIp, rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows requests up to the limit and blocks the next", async () => {
    const key = "limit-test";
    expect(await rateLimit(key, 2, 1000)).toBe(true);
    expect(await rateLimit(key, 2, 1000)).toBe(true);
    expect(await rateLimit(key, 2, 1000)).toBe(false);
  });

  it("resets after the window elapses", async () => {
    const key = "reset-test";
    expect(await rateLimit(key, 1, 1)).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 5));
    expect(await rateLimit(key, 1, 1)).toBe(true);
  });
});

describe("clientIp", () => {
  it("takes the first x-forwarded-for hop", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe("1.2.3.4");
  });

  it("falls back to unknown", () => {
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
