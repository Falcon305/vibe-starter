import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./paths";
import type { ModuleManifest } from "./schema";

const LEGAL_FILE = path.join(ROOT, "lib/legal/modules.generated.ts");
const CSP_FILE = path.join(ROOT, "lib/security/csp.generated.ts");

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
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
}
