import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./paths";
import type { ModuleManifest } from "./schema";

const LEGAL_FILE = path.join(ROOT, "lib/legal/modules.generated.ts");
const CSP_FILE = path.join(ROOT, "lib/security/csp.generated.ts");
const ENV_FILE = path.join(ROOT, "lib/env.generated.ts");
const DB_SCHEMA_DIR = path.join(ROOT, "lib/db/schema");
const CONFIG_PLUGINS_DIR = path.join(ROOT, "lib/config-plugins");
const AUTH_PLUGINS_DIR = path.join(ROOT, "lib/auth/plugins");

function siblingModules(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".ts") && file !== "index.ts")
    .map((file) => file.replace(/\.ts$/, ""))
    .sort();
}

function regenerateDbSchema(): void {
  if (!fs.existsSync(DB_SCHEMA_DIR)) return;
  const body = siblingModules(DB_SCHEMA_DIR)
    .map((name) => `export * from "./${name}";`)
    .join("\n");
  fs.writeFileSync(path.join(DB_SCHEMA_DIR, "index.ts"), `${body}\n`);
}

function regenerateConfigPlugins(): void {
  if (!fs.existsSync(CONFIG_PLUGINS_DIR)) return;
  const modules = siblingModules(CONFIG_PLUGINS_DIR);
  const imports = modules.map((name) => `import ${name} from "./${name}";`).join("\n");
  const list = modules.join(", ");
  const file = `import type { NextConfig } from "next";
${imports}

export function withModulePlugins(config: NextConfig): NextConfig {
  return [${list}].reduce((current, wrap) => wrap(current), config);
}
`;
  fs.writeFileSync(path.join(CONFIG_PLUGINS_DIR, "index.ts"), file);
}

function regenerateAuthPlugins(): void {
  if (!fs.existsSync(AUTH_PLUGINS_DIR)) return;
  const modules = siblingModules(AUTH_PLUGINS_DIR);
  const imports = modules.map((name) => `import ${name} from "./${name}";`).join("\n");
  const list = modules.join(", ");
  const file = `${imports}

export const authPlugins = [${list}];
`;
  fs.writeFileSync(path.join(AUTH_PLUGINS_DIR, "index.ts"), file);
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

type EnvVar = ModuleManifest["env"][number];

function zodFor(variable: EnvVar): string {
  const base = "z.string().min(1)";
  return variable.required ? base : `${base}.optional()`;
}

function writeEnv(manifests: ModuleManifest[]): void {
  const seen = new Set<string>();
  const variables = manifests
    .flatMap((manifest) => manifest.env)
    .filter((variable) => {
      if (seen.has(variable.key)) return false;
      seen.add(variable.key);
      return true;
    });

  const server = variables.filter((variable) => !variable.key.startsWith("NEXT_PUBLIC_"));
  const client = variables.filter((variable) => variable.key.startsWith("NEXT_PUBLIC_"));

  const entries = (list: EnvVar[]) =>
    list.map((variable) => `  ${variable.key}: ${zodFor(variable)},`).join("\n");
  const runtime = (list: EnvVar[]) =>
    list.map((variable) => `  ${variable.key}: process.env.${variable.key},`).join("\n");

  const header = variables.length > 0 ? 'import { z } from "zod";\n\n' : "";
  const file = `${header}export const generatedServerEnv = {${server.length ? `\n${entries(server)}\n` : ""}};

export const generatedClientEnv = {${client.length ? `\n${entries(client)}\n` : ""}};

export const generatedRuntimeEnv = {${variables.length ? `\n${runtime(variables)}\n` : ""}};
`;
  fs.writeFileSync(ENV_FILE, file);
}

export function regenerate(manifests: ModuleManifest[]): void {
  const subprocessors = manifests.flatMap((manifest) => manifest.legal.subprocessors);
  const cookies = manifests.flatMap((manifest) => manifest.legal.cookies);
  const dataCollected = dedupe(manifests.flatMap((manifest) => manifest.legal.dataCollected));

  const legal = `import type { CookieEntry, Subprocessor } from "@/lib/legal/config";

export const moduleSubprocessors: Subprocessor[] = ${JSON.stringify(subprocessors, null, 2)};

export const moduleCookies: CookieEntry[] = ${JSON.stringify(cookies, null, 2)};

export const moduleDataCollected: string[] = ${JSON.stringify(dataCollected, null, 2)};
`;
  fs.writeFileSync(LEGAL_FILE, legal);

  const csp = {
    scriptSrc: dedupe(manifests.flatMap((manifest) => manifest.csp.scriptSrc)),
    connectSrc: dedupe(manifests.flatMap((manifest) => manifest.csp.connectSrc)),
    imgSrc: dedupe(manifests.flatMap((manifest) => manifest.csp.imgSrc)),
    frameSrc: dedupe(manifests.flatMap((manifest) => manifest.csp.frameSrc)),
  };

  const cspFile = `export const cspAdditions = {
  scriptSrc: ${JSON.stringify(csp.scriptSrc)} as string[],
  connectSrc: ${JSON.stringify(csp.connectSrc)} as string[],
  imgSrc: ${JSON.stringify(csp.imgSrc)} as string[],
  frameSrc: ${JSON.stringify(csp.frameSrc)} as string[],
};
`;
  fs.writeFileSync(CSP_FILE, cspFile);

  writeEnv(manifests);
  regenerateDbSchema();
  regenerateConfigPlugins();
  regenerateAuthPlugins();
}
