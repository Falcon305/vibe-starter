import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { regenerate } from "./generate";
import {
  hashFile,
  type InstalledFile,
  type InstalledModule,
  readLockfile,
  writeLockfile,
} from "./lockfile";
import { ENV_EXAMPLE, PACKAGE_JSON, REGISTRY_DIR, ROOT } from "./paths";
import { loadManifest, resolveInstallOrder } from "./registry";
import type { ModuleManifest } from "./schema";

const packageJsonSchema = z.looseObject({
  dependencies: z.record(z.string(), z.string()).default({}),
  devDependencies: z.record(z.string(), z.string()).default({}),
  scripts: z.record(z.string(), z.string()).default({}),
});

function walkFiles(dir: string, base: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(full, base);
    return [path.relative(base, full)];
  });
}

const BACKUP_DIR = path.join(ROOT, ".vibe/backups");

const DENIED_PATTERNS = [
  /^next\.config\.ts$/,
  /^lib\/env\.ts$/,
  /^lib\/security\//,
  /^lib\/consent\//,
  /\.generated\.ts$/,
];

function isDeniedPath(relativePath: string): boolean {
  return DENIED_PATTERNS.some((pattern) => pattern.test(relativePath));
}

function backupPath(name: string, relativePath: string): string {
  return path.join(BACKUP_DIR, name, relativePath);
}

function assertInstallable(manifest: ModuleManifest, relativePaths: string[]): void {
  for (const relativePath of relativePaths) {
    if (isDeniedPath(relativePath)) {
      throw new Error(
        `${manifest.name} ships protected base file ${relativePath}; modules may never replace it.`,
      );
    }
    const destination = path.join(ROOT, relativePath);
    if (fs.existsSync(destination) && !manifest.overwrites.includes(relativePath)) {
      throw new Error(
        `${manifest.name} would overwrite ${relativePath} without declaring it in "overwrites".`,
      );
    }
  }
}

type CopyJournal = { relativePath: string; backedUp: boolean };

function rollbackCopies(name: string, journal: CopyJournal[]): void {
  for (const entry of [...journal].reverse()) {
    const destination = path.join(ROOT, entry.relativePath);
    const backup = backupPath(name, entry.relativePath);
    if (entry.backedUp && fs.existsSync(backup)) {
      fs.copyFileSync(backup, destination);
    } else if (fs.existsSync(destination)) {
      fs.rmSync(destination);
    }
  }
  const moduleBackup = path.join(BACKUP_DIR, name);
  if (fs.existsSync(moduleBackup)) fs.rmSync(moduleBackup, { recursive: true, force: true });
}

function copyModuleFiles(manifest: ModuleManifest): InstalledFile[] {
  const filesDir = path.join(REGISTRY_DIR, manifest.name, "files");
  const relativePaths = walkFiles(filesDir, filesDir);
  assertInstallable(manifest, relativePaths);

  const journal: CopyJournal[] = [];
  const overwritten: string[] = [];
  try {
    for (const relativePath of relativePaths) {
      const destination = path.join(ROOT, relativePath);
      const backedUp = fs.existsSync(destination);
      if (backedUp) {
        overwritten.push(relativePath);
        const backup = backupPath(manifest.name, relativePath);
        fs.mkdirSync(path.dirname(backup), { recursive: true });
        fs.copyFileSync(destination, backup);
      }
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(path.join(filesDir, relativePath), destination);
      journal.push({ relativePath, backedUp });
    }
  } catch (error) {
    rollbackCopies(manifest.name, journal);
    throw error;
  }

  if (overwritten.length > 0) {
    console.warn(`  overwrote declared base files (backed up): ${overwritten.join(", ")}`);
  }
  return relativePaths.map((relativePath) => ({
    path: relativePath,
    hash: hashFile(path.join(ROOT, relativePath)),
  }));
}

function mergePackageJson(manifests: ModuleManifest[]): boolean {
  const raw = z
    .record(z.string(), z.unknown())
    .parse(JSON.parse(fs.readFileSync(PACKAGE_JSON, "utf8")));
  const pkg = packageJsonSchema.parse(raw);
  let depsChanged = false;

  for (const manifest of manifests) {
    for (const [dep, version] of Object.entries(manifest.dependencies)) {
      if (pkg.dependencies[dep] !== version) {
        pkg.dependencies[dep] = version;
        depsChanged = true;
      }
    }
    for (const [dep, version] of Object.entries(manifest.devDependencies)) {
      if (pkg.devDependencies[dep] !== version) {
        pkg.devDependencies[dep] = version;
        depsChanged = true;
      }
    }
    for (const [name, command] of Object.entries(manifest.scripts)) {
      pkg.scripts[name] ??= command;
    }
  }

  raw.dependencies = sortRecord(pkg.dependencies);
  raw.devDependencies = sortRecord(pkg.devDependencies);
  raw.scripts = pkg.scripts;
  fs.writeFileSync(PACKAGE_JSON, `${JSON.stringify(raw, null, 2)}\n`);
  return depsChanged;
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

const EXCLUSIVE_CAPABILITIES = new Set(["auth", "db"]);

function assertNoCapabilityConflicts(names: Iterable<string>): void {
  const providers = new Map<string, string[]>();
  for (const name of new Set(names)) {
    for (const capability of loadManifest(name).provides) {
      if (!EXCLUSIVE_CAPABILITIES.has(capability)) continue;
      providers.set(capability, [...(providers.get(capability) ?? []), name]);
    }
  }
  for (const [capability, list] of providers) {
    if (list.length > 1) {
      throw new Error(
        `Cannot install: multiple "${capability}" providers (${list.join(", ")}). Remove one first.`,
      );
    }
  }
}

export function installModules(requested: string[]): InstallResult {
  const order = resolveInstallOrder(requested);
  const lockfile = readLockfile();
  const alreadyInstalled = new Set(lockfile.modules.map((module) => module.name));
  assertNoCapabilityConflicts([...alreadyInstalled, ...order]);

  const pending = order.filter((name) => !alreadyInstalled.has(name));
  const skipped = order.filter((name) => alreadyInstalled.has(name));
  for (const name of pending) {
    const manifest = loadManifest(name);
    const filesDir = path.join(REGISTRY_DIR, name, "files");
    assertInstallable(manifest, walkFiles(filesDir, filesDir));
  }

  const installed: string[] = [];
  const newlyInstalled: InstalledModule[] = [];
  try {
    for (const name of pending) {
      const manifest = loadManifest(name);
      const files = copyModuleFiles(manifest);
      newlyInstalled.push({
        name,
        version: manifest.version,
        files,
        installedAt: new Date().toISOString(),
      });
      installed.push(name);
    }
  } catch (error) {
    for (const entry of [...newlyInstalled].reverse()) {
      rollbackCopies(
        entry.name,
        entry.files.map((file) => ({ relativePath: file.path, backedUp: false })),
      );
    }
    throw error;
  }

  lockfile.modules.push(...newlyInstalled);
  writeLockfile(lockfile);

  const allManifests = lockfile.modules.map((module) => loadManifest(module.name));
  regenerate(allManifests);

  const newManifests = installed.map(loadManifest);
  const depsChanged = mergePackageJson(newManifests);
  const envAdded = appendEnv(newManifests);
  const postInstall = newManifests.flatMap((manifest) => manifest.postInstall);

  return { installed, skipped, depsChanged, envAdded, postInstall };
}

export function locallyModifiedFiles(module: InstalledModule): string[] {
  return module.files
    .filter((file) => {
      const absolute = path.join(ROOT, file.path);
      return fs.existsSync(absolute) && hashFile(absolute) !== file.hash;
    })
    .map((file) => file.path);
}

export type UpdateResult = {
  updated: boolean;
  depsChanged: boolean;
  envAdded: string[];
  blockedBy: string[];
};

export function updateModule(name: string, force = false): UpdateResult {
  const lockfile = readLockfile();
  const target = lockfile.modules.find((module) => module.name === name);
  if (!target) return { updated: false, depsChanged: false, envAdded: [], blockedBy: [] };

  const modified = locallyModifiedFiles(target);
  if (modified.length > 0 && !force) {
    return { updated: false, depsChanged: false, envAdded: [], blockedBy: modified };
  }

  const filesDir = path.join(REGISTRY_DIR, name, "files");
  const relativePaths = walkFiles(filesDir, filesDir);
  const previous = new Map(target.files.map((file) => [file.path, file]));

  for (const relativePath of relativePaths) {
    if (isDeniedPath(relativePath)) {
      throw new Error(
        `${name} ships protected base file ${relativePath}; modules may never replace it.`,
      );
    }
    const destination = path.join(ROOT, relativePath);
    const backup = backupPath(name, relativePath);
    if (!previous.has(relativePath) && fs.existsSync(destination) && !fs.existsSync(backup)) {
      fs.mkdirSync(path.dirname(backup), { recursive: true });
      fs.copyFileSync(destination, backup);
    }
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(filesDir, relativePath), destination);
  }

  for (const file of target.files) {
    if (relativePaths.includes(file.path)) continue;
    const destination = path.join(ROOT, file.path);
    const backup = backupPath(name, file.path);
    if (fs.existsSync(backup)) {
      fs.copyFileSync(backup, destination);
      fs.rmSync(backup);
    } else if (fs.existsSync(destination)) {
      fs.rmSync(destination);
    }
  }

  const manifest = loadManifest(name);
  target.files = relativePaths.map((relativePath) => ({
    path: relativePath,
    hash: hashFile(path.join(ROOT, relativePath)),
  }));
  target.version = manifest.version;
  writeLockfile(lockfile);
  regenerate(lockfile.modules.map((module) => loadManifest(module.name)));

  const depsChanged = mergePackageJson([manifest]);
  const envAdded = appendEnv([manifest]);
  return { updated: true, depsChanged, envAdded, blockedBy: [] };
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

  for (const file of target.files) {
    const destination = path.join(ROOT, file.path);
    const backup = backupPath(name, file.path);
    if (fs.existsSync(backup)) {
      fs.copyFileSync(backup, destination);
    } else if (fs.existsSync(destination)) {
      fs.rmSync(destination);
    }
  }
  const moduleBackup = path.join(BACKUP_DIR, name);
  if (fs.existsSync(moduleBackup)) fs.rmSync(moduleBackup, { recursive: true, force: true });

  lockfile.modules = lockfile.modules.filter((module) => module.name !== name);
  writeLockfile(lockfile);
  regenerate(lockfile.modules.map((module) => loadManifest(module.name)));
  return true;
}
