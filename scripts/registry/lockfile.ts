import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { LOCKFILE, ROOT, VIBE_DIR } from "./paths";

const installedFileSchema = z.object({
  path: z.string(),
  hash: z.string(),
});

const installedModuleSchema = z.object({
  name: z.string(),
  version: z.string(),
  files: z.array(z.union([z.string(), installedFileSchema])),
  installedAt: z.string(),
});

const lockfileSchema = z.object({
  schemaVersion: z.number().default(1),
  modules: z.array(installedModuleSchema).default([]),
});

export type InstalledFile = z.infer<typeof installedFileSchema>;

export type InstalledModule = {
  name: string;
  version: string;
  files: InstalledFile[];
  installedAt: string;
};

export type Lockfile = {
  schemaVersion: number;
  modules: InstalledModule[];
};

export const LOCKFILE_SCHEMA_VERSION = 2;

export function hashFile(absolutePath: string): string {
  return crypto.createHash("sha256").update(fs.readFileSync(absolutePath)).digest("hex");
}

function migrateFiles(files: (string | InstalledFile)[]): InstalledFile[] {
  return files.map((file) => {
    if (typeof file !== "string") return file;
    const absolute = path.join(ROOT, file);
    return { path: file, hash: fs.existsSync(absolute) ? hashFile(absolute) : "" };
  });
}

export function readLockfile(): Lockfile {
  if (!fs.existsSync(LOCKFILE)) return { schemaVersion: LOCKFILE_SCHEMA_VERSION, modules: [] };
  const parsed = lockfileSchema.safeParse(JSON.parse(fs.readFileSync(LOCKFILE, "utf8")));
  if (!parsed.success) {
    throw new Error(
      `Corrupt lockfile at ${LOCKFILE}: ${parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ")}`,
    );
  }
  return {
    schemaVersion: LOCKFILE_SCHEMA_VERSION,
    modules: parsed.data.modules.map((module) => ({
      ...module,
      files: migrateFiles(module.files),
    })),
  };
}

export function writeLockfile(lockfile: Lockfile): void {
  if (!fs.existsSync(VIBE_DIR)) fs.mkdirSync(VIBE_DIR, { recursive: true });
  const sorted = [...lockfile.modules].sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(
    LOCKFILE,
    `${JSON.stringify({ schemaVersion: LOCKFILE_SCHEMA_VERSION, modules: sorted }, null, 2)}\n`,
  );
}

export function isInstalled(name: string): boolean {
  return readLockfile().modules.some((module) => module.name === name);
}
