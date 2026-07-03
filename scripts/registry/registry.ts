import fs from "node:fs";
import path from "node:path";
import { REGISTRY_DIR } from "./paths";
import { type ModuleManifest, moduleManifestSchema } from "./schema";

export function listModuleNames(): string[] {
  if (!fs.existsSync(REGISTRY_DIR)) return [];
  return fs
    .readdirSync(REGISTRY_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(REGISTRY_DIR, entry.name, "module.json")))
    .map((entry) => entry.name)
    .sort();
}

export function loadManifest(name: string): ModuleManifest {
  const file = path.join(REGISTRY_DIR, name, "module.json");
  if (!fs.existsSync(file)) throw new Error(`Unknown module: ${name}`);
  const raw: unknown = JSON.parse(fs.readFileSync(file, "utf8"));
  const manifest = moduleManifestSchema.parse(raw);
  if (manifest.name !== name) {
    throw new Error(`Module directory "${name}" declares name "${manifest.name}"`);
  }
  return manifest;
}

export function loadAllManifests(): ModuleManifest[] {
  return listModuleNames().map(loadManifest);
}

export function resolveInstallOrder(names: string[]): string[] {
  const visited = new Set<string>();
  const order: string[] = [];

  function visit(name: string, trail: string[]) {
    if (order.includes(name)) return;
    if (trail.includes(name)) {
      throw new Error(`Circular dependency: ${[...trail, name].join(" -> ")}`);
    }
    visited.add(name);
    const manifest = loadManifest(name);
    for (const dependency of manifest.dependsOn) {
      visit(dependency, [...trail, name]);
    }
    order.push(name);
  }

  for (const name of names) visit(name, []);
  return order;
}
