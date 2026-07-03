import path from "node:path";

export const ROOT = process.cwd();
export const REGISTRY_DIR = path.join(ROOT, "registry");
export const VIBE_DIR = path.join(ROOT, ".vibe");
export const LOCKFILE = path.join(VIBE_DIR, "installed.json");
export const ENV_EXAMPLE = path.join(ROOT, ".env.example");
export const PACKAGE_JSON = path.join(ROOT, "package.json");
