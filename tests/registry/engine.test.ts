import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vibe-engine-"));
vi.spyOn(process, "cwd").mockReturnValue(tmp);

const { installModules, locallyModifiedFiles, removeModule, updateModule } =
  await import("@/scripts/registry/install");
const { readLockfile } = await import("@/scripts/registry/lockfile");

function write(relativePath: string, content: string): void {
  const full = path.join(tmp, relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function manifest(name: string, extra: Record<string, unknown> = {}): void {
  write(
    `registry/${name}/module.json`,
    JSON.stringify({
      name,
      title: name,
      description: `${name} fixture`,
      category: "test",
      ...extra,
    }),
  );
}

write(
  "package.json",
  JSON.stringify({ name: "fixture", dependencies: {}, devDependencies: {}, scripts: {} }),
);
write(".env.example", "");
write("lib/legal/.keep", "");
write("lib/security/.keep", "");
write("lib/base-widget.ts", "export const original = true;\n");

manifest("alpha", { provides: ["auth"] });
write("registry/alpha/files/lib/alpha.ts", "export const alpha = 1;\n");

manifest("beta", { provides: ["auth"] });
write("registry/beta/files/lib/beta.ts", "export const beta = 1;\n");

manifest("gamma", { overwrites: ["lib/base-widget.ts"] });
write("registry/gamma/files/lib/base-widget.ts", "export const replaced = true;\n");

manifest("delta");
write("registry/delta/files/lib/base-widget.ts", "export const rogue = true;\n");

manifest("evil");
write("registry/evil/files/lib/security/evil.ts", "export const evil = true;\n");

manifest("broken");
write("registry/broken/files/lib/broken-a.ts", "export const a = 1;\n");
write("registry/broken/files/nested/z.ts", "export const z = 1;\n");
write("nested", "");

describe("engine", () => {
  it("installs a module with hashed lockfile entries", () => {
    const result = installModules(["alpha"]);
    expect(result.installed).toEqual(["alpha"]);
    expect(fs.existsSync(path.join(tmp, "lib/alpha.ts"))).toBe(true);
    const entry = readLockfile().modules.find((module) => module.name === "alpha");
    expect(entry?.files[0]?.path).toBe("lib/alpha.ts");
    expect(entry?.files[0]?.hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("refuses a second provider of an exclusive capability", () => {
    expect(() => installModules(["beta"])).toThrow(/multiple "auth" providers/);
  });

  it("detects local modification and blocks update without force", () => {
    fs.appendFileSync(path.join(tmp, "lib/alpha.ts"), "export const tampered = true;\n");
    const entry = readLockfile().modules.find((module) => module.name === "alpha");
    expect(entry && locallyModifiedFiles(entry)).toEqual(["lib/alpha.ts"]);
    const blocked = updateModule("alpha");
    expect(blocked.updated).toBe(false);
    expect(blocked.blockedBy).toEqual(["lib/alpha.ts"]);
  });

  it("re-syncs the modified file with force", () => {
    const forced = updateModule("alpha", true);
    expect(forced.updated).toBe(true);
    expect(fs.readFileSync(path.join(tmp, "lib/alpha.ts"), "utf8")).not.toContain("tampered");
    const entry = readLockfile().modules.find((module) => module.name === "alpha");
    expect(entry && locallyModifiedFiles(entry)).toEqual([]);
  });

  it("backs up a declared overwrite and restores it on remove", () => {
    installModules(["gamma"]);
    expect(fs.readFileSync(path.join(tmp, "lib/base-widget.ts"), "utf8")).toContain("replaced");
    expect(removeModule("gamma")).toBe(true);
    expect(fs.readFileSync(path.join(tmp, "lib/base-widget.ts"), "utf8")).toContain("original");
  });

  it("rejects an undeclared overwrite of an existing file", () => {
    expect(() => installModules(["delta"])).toThrow(/without declaring it in "overwrites"/);
    expect(fs.readFileSync(path.join(tmp, "lib/base-widget.ts"), "utf8")).toContain("original");
  });

  it("rejects a module shipping a protected base path", () => {
    expect(() => installModules(["evil"])).toThrow(/protected base file/);
    expect(fs.existsSync(path.join(tmp, "lib/security/evil.ts"))).toBe(false);
  });

  it("rolls back a failed install without orphan files or lockfile entries", () => {
    expect(() => installModules(["broken"])).toThrow();
    expect(fs.existsSync(path.join(tmp, "lib/broken-a.ts"))).toBe(false);
    expect(readLockfile().modules.map((module) => module.name)).not.toContain("broken");
  });

  it("removes cleanly and leaves an empty module list", () => {
    expect(removeModule("alpha")).toBe(true);
    expect(fs.existsSync(path.join(tmp, "lib/alpha.ts"))).toBe(false);
    expect(readLockfile().modules).toEqual([]);
  });
});
