import fs from "node:fs";
import { LOCKFILE, VIBE_DIR } from "./paths";

export type InstalledModule = {
  name: string;
  version: string;
  files: string[];
  installedAt: string;
};

export type Lockfile = {
  modules: InstalledModule[];
};

export function readLockfile(): Lockfile {
  if (!fs.existsSync(LOCKFILE)) return { modules: [] };
  return JSON.parse(fs.readFileSync(LOCKFILE, "utf8")) as Lockfile;
}

export function writeLockfile(lockfile: Lockfile): void {
  if (!fs.existsSync(VIBE_DIR)) fs.mkdirSync(VIBE_DIR, { recursive: true });
  const sorted = [...lockfile.modules].sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(LOCKFILE, `${JSON.stringify({ modules: sorted }, null, 2)}\n`);
}

export function isInstalled(name: string): boolean {
  return readLockfile().modules.some((module) => module.name === name);
}
