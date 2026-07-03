import { describe, expect, it } from "vitest";
import { resolveInstallOrder } from "@/scripts/registry/registry";

describe("resolveInstallOrder", () => {
  it("installs dependencies before dependents", () => {
    const order = resolveInstallOrder(["dashboard"]);
    expect(order.indexOf("db-drizzle-neon")).toBeLessThan(order.indexOf("auth-better-auth"));
    expect(order.indexOf("auth-better-auth")).toBeLessThan(order.indexOf("dashboard"));
  });

  it("dedupes a shared dependency", () => {
    const order = resolveInstallOrder(["dashboard", "admin"]);
    expect(order.filter((name) => name === "auth-better-auth")).toHaveLength(1);
  });

  it("rejects an unknown module", () => {
    expect(() => resolveInstallOrder(["does-not-exist"])).toThrow();
  });
});
