import fs from "node:fs";
import path from "node:path";
import { regenerate } from "./generate";
import { type InstalledModule, readLockfile, writeLockfile } from "./lockfile";
import { ENV_EXAMPLE, PACKAGE_JSON, REGISTRY_DIR, ROOT } from "./paths";
import { loadManifest, resolveInstallOrder } from "./registry";
import type { ModuleManifest } from "./schema";

function walkFiles(dir: string, base: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(full, base);
    return [path.relative(base, full)];
  });
}

function copyModuleFiles(name: string): string[] {
  const filesDir = path.join(REGISTRY_DIR, name, "files");
  const relativePaths = walkFiles(filesDir, filesDir);
  const conflicts: string[] = [];

  for (const relativePath of relativePaths) {
    const destination = path.join(ROOT, relativePath);
    if (fs.existsSync(destination)) conflicts.push(relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(filesDir, relativePath), destination);
  }

  if (conflicts.length > 0) {
    console.warn(`  overwrote existing files: ${conflicts.join(", ")}`);
  }
  return relativePaths;
}

function mergeDependencies(manifests: ModuleManifest[]): boolean {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, "utf8"));
  pkg.dependencies ??= {};
  pkg.devDependencies ??= {};
  let changed = false;

  for (const manifest of manifests) {
    for (const [dep, version] of Object.entries(manifest.dependencies)) {
      if (pkg.dependencies[dep] !== version) {
        pkg.dependencies[dep] = version;
        changed = true;
      }
    }
    for (const [dep, version] of Object.entries(manifest.devDependencies)) {
      if (pkg.devDependencies[dep] !== version) {
        pkg.devDependencies[dep] = version;
        changed = true;
      }
    }
  }

  if (changed) {
    pkg.dependencies = sortRecord(pkg.dependencies);
    pkg.devDependencies = sortRecord(pkg.devDependencies);
    fs.writeFileSync(PACKAGE_JSON, `${JSON.stringify(pkg, null, 2)}\n`);
  }
  return changed;
}

function sortRecord(record: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));
}

function appendEnv(manifests: ModuleManifest[]): string[] {
  const current = fs.existsSync(ENV_EXAMPLE) ? fs.readFileSync(ENV_EXAMPLE, "utf8") : "";
  const present = new Set(
    current
      .split("\n")
      .map((line) => line.split("=")[0]?.trim())
      .filter(Boolean),
  );
  const additions: string[] = [];

  for (const manifest of manifests) {
    for (const variable of manifest.env) {
      if (present.has(variable.key)) continue;
      present.add(variable.key);
      additions.push(`${variable.key}=${variable.example ?? ""}`);
    }
  }

  if (additions.length > 0) {
    const separator = current.endsWith("\n") || current === "" ? "" : "\n";
    fs.writeFileSync(ENV_EXAMPLE, `${current}${separator}${additions.join("\n")}\n`);
  }
  return additions;
}

export type InstallResult = {
  installed: string[];
  skipped: string[];
  depsChanged: boolean;
  envAdded: string[];
  postInstall: string[];
};

export function installModules(requested: string[]): InstallResult {
  const order = resolveInstallOrder(requested);
  const lockfile = readLockfile();
  const alreadyInstalled = new Set(lockfile.modules.map((module) => module.name));

  const installed: string[] = [];
  const skipped: string[] = [];
  const newlyInstalled: InstalledModule[] = [];

  for (const name of order) {
    if (alreadyInstalled.has(name)) {
      skipped.push(name);
      continue;
    }
    const manifest = loadManifest(name);
    const files = copyModuleFiles(name);
    newlyInstalled.push({
      name,
      version: manifest.version,
      files,
      installedAt: new Date().toISOString(),
    });
    installed.push(name);
  }

  lockfile.modules.push(...newlyInstalled);
  writeLockfile(lockfile);

  const allManifests = lockfile.modules.map((module) => loadManifest(module.name));
  regenerate(allManifests);

  const newManifests = installed.map(loadManifest);
  const depsChanged = mergeDependencies(newManifests);
  const envAdded = appendEnv(newManifests);
  const postInstall = newManifests.flatMap((manifest) => manifest.postInstall);

  return { installed, skipped, depsChanged, envAdded, postInstall };
}

export function removeModule(name: string): boolean {
  const lockfile = readLockfile();
  const target = lockfile.modules.find((module) => module.name === name);
  if (!target) return false;

  const dependents = lockfile.modules.filter((module) =>
    loadManifest(module.name).dependsOn.includes(name),
  );
  if (dependents.length > 0) {
    throw new Error(`${name} is required by: ${dependents.map((m) => m.name).join(", ")}`);
  }

  for (const relativePath of target.files) {
    const destination = path.join(ROOT, relativePath);
    if (fs.existsSync(destination)) fs.rmSync(destination);
  }

  lockfile.modules = lockfile.modules.filter((module) => module.name !== name);
  writeLockfile(lockfile);
  regenerate(lockfile.modules.map((module) => loadManifest(module.name)));
  return true;
}
