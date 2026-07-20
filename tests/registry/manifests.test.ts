import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { moduleManifestSchema } from "@/scripts/registry/schema";

const registryDir = path.resolve("registry");
const names = fs
  .readdirSync(registryDir)
  .filter((name) => fs.existsSync(path.join(registryDir, name, "module.json")))
  .sort();

describe("module manifests", () => {
  it("finds the full catalog", () => {
    expect(names.length).toBeGreaterThanOrEqual(24);
  });

  it.each(names)("%s parses through the schema and matches its directory", (name) => {
    const raw = JSON.parse(fs.readFileSync(path.join(registryDir, name, "module.json"), "utf8"));
    const manifest = moduleManifestSchema.parse(raw);
    expect(manifest.name).toBe(name);
    expect(manifest.description.length).toBeGreaterThan(0);
  });

  it.each(names)("%s ships every file its overwrites declare", (name) => {
    const raw = JSON.parse(fs.readFileSync(path.join(registryDir, name, "module.json"), "utf8"));
    const manifest = moduleManifestSchema.parse(raw);
    for (const overwrite of manifest.overwrites) {
      expect(fs.existsSync(path.join(registryDir, name, "files", overwrite))).toBe(true);
    }
  });

  it.each(names)("%s depends only on modules that exist", (name) => {
    const raw = JSON.parse(fs.readFileSync(path.join(registryDir, name, "module.json"), "utf8"));
    const manifest = moduleManifestSchema.parse(raw);
    for (const dependency of manifest.dependsOn) {
      expect(names).toContain(dependency);
    }
  });
});
