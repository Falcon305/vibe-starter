import fs from "node:fs";
import path from "node:path";
import { readLockfile } from "./lockfile";
import { ENV_EXAMPLE, ROOT } from "./paths";
import { loadManifest } from "./registry";

const EXCLUSIVE_CAPABILITIES = new Set(["auth", "db"]);

type Finding = { level: "error" | "warn"; message: string };

function readEnvKeys(file: string): Set<string> {
  if (!fs.existsSync(file)) return new Set();
  return new Set(
    fs
      .readFileSync(file, "utf8")
      .split("\n")
      .map((line) => line.split("=")[0]?.trim())
      .filter((key): key is string => !!key && !key.startsWith("#")),
  );
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return full.endsWith(".ts") || full.endsWith(".tsx") ? [full] : [];
  });
}

function scanClientSecrets(): Finding[] {
  const leak = /process\.env\.(?!NEXT_PUBLIC_)[A-Z0-9_]+/;
  const findings: Finding[] = [];
  for (const dir of ["app", "components"]) {
    for (const file of walk(path.join(ROOT, dir))) {
      const source = fs.readFileSync(file, "utf8");
      if (!/^["']use client["']/m.test(source)) continue;
      if (leak.test(source)) {
        findings.push({
          level: "error",
          message: `${path.relative(ROOT, file)} is a client component reading a server env var.`,
        });
      }
    }
  }
  return findings;
}

export function runDoctor(): boolean {
  const findings: Finding[] = [];
  const lockfile = readLockfile();
  const manifests = lockfile.modules.map((module) => loadManifest(module.name));

  const byCapability = new Map<string, string[]>();
  for (const manifest of manifests) {
    for (const capability of manifest.provides) {
      byCapability.set(capability, [...(byCapability.get(capability) ?? []), manifest.name]);
    }
  }
  for (const [capability, providers] of byCapability) {
    if (EXCLUSIVE_CAPABILITIES.has(capability) && providers.length > 1) {
      findings.push({
        level: "error",
        message: `Multiple "${capability}" providers installed: ${providers.join(", ")}. Keep one.`,
      });
    }
  }

  const byRoute = new Map<string, string[]>();
  for (const manifest of manifests) {
    for (const route of manifest.routes) {
      byRoute.set(route, [...(byRoute.get(route) ?? []), manifest.name]);
    }
  }
  for (const [route, owners] of byRoute) {
    if (owners.length > 1) {
      findings.push({
        level: "error",
        message: `Route ${route} is declared by multiple modules: ${owners.join(", ")}.`,
      });
    }
  }

  for (const entry of lockfile.modules) {
    for (const file of entry.files) {
      if (!fs.existsSync(path.join(ROOT, file))) {
        findings.push({
          level: "error",
          message: `${entry.name}: missing installed file ${file}.`,
        });
      }
    }
  }

  const localKeys = readEnvKeys(path.join(ROOT, ".env.local"));
  const exampleKeys = readEnvKeys(ENV_EXAMPLE);
  for (const manifest of manifests) {
    for (const variable of manifest.env) {
      if (!variable.required) continue;
      if (localKeys.size > 0 && !localKeys.has(variable.key)) {
        findings.push({
          level: "warn",
          message: `${manifest.name}: required env ${variable.key} is not set in .env.local.`,
        });
      }
      if (!exampleKeys.has(variable.key)) {
        findings.push({
          level: "warn",
          message: `${manifest.name}: env ${variable.key} is missing from .env.example.`,
        });
      }
    }
  }

  findings.push(...scanClientSecrets());

  const cspGenerated = path.join(ROOT, "lib/security/csp.generated.ts");
  if (
    !fs.existsSync(cspGenerated) ||
    !fs.readFileSync(cspGenerated, "utf8").includes("cspAdditions")
  ) {
    findings.push({
      level: "error",
      message: "lib/security/csp.generated.ts is missing or malformed.",
    });
  }
  const cspBase = path.join(ROOT, "lib/security/csp.ts");
  if (
    fs.existsSync(cspBase) &&
    !fs.readFileSync(cspBase, "utf8").includes("buildContentSecurityPolicy")
  ) {
    findings.push({ level: "error", message: "lib/security/csp.ts no longer builds the policy." });
  }

  const errors = findings.filter((finding) => finding.level === "error");
  const warnings = findings.filter((finding) => finding.level === "warn");

  for (const finding of findings) {
    const label = finding.level === "error" ? "FAIL" : "warn";
    process.stdout.write(`  ${label}  ${finding.message}\n`);
  }
  if (findings.length === 0) {
    process.stdout.write("  All checks passed.\n");
  }
  process.stdout.write(
    `\n${errors.length} error(s), ${warnings.length} warning(s) across ${manifests.length} installed module(s).\n`,
  );

  return errors.length === 0;
}
