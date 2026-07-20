import { z } from "zod";

export const envVarSchema = z.object({
  key: z.string(),
  required: z.boolean().default(true),
  secret: z.boolean().default(false),
  description: z.string().optional(),
  example: z.string().optional(),
});

export const subprocessorSchema = z.object({
  name: z.string(),
  purpose: z.string(),
  url: z.string().optional(),
});

export const cookieSchema = z.object({
  name: z.string(),
  category: z.enum(["necessary", "analytics", "marketing"]),
  purpose: z.string(),
  provider: z.string(),
  retention: z.string(),
});

export const moduleManifestSchema = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  version: z.string().default("0.1.0"),
  dependsOn: z.array(z.string()).default([]),
  provides: z.array(z.string()).default([]),
  dependencies: z.record(z.string(), z.string()).default({}),
  devDependencies: z.record(z.string(), z.string()).default({}),
  scripts: z.record(z.string(), z.string()).default({}),
  env: z.array(envVarSchema).default([]),
  routes: z.array(z.string()).default([]),
  overwrites: z.array(z.string()).default([]),
  postInstall: z.array(z.string()).default([]),
  csp: z
    .object({
      scriptSrc: z.array(z.string()).default([]),
      connectSrc: z.array(z.string()).default([]),
      imgSrc: z.array(z.string()).default([]),
      frameSrc: z.array(z.string()).default([]),
    })
    .default({ scriptSrc: [], connectSrc: [], imgSrc: [], frameSrc: [] }),
  legal: z
    .object({
      subprocessors: z.array(subprocessorSchema).default([]),
      cookies: z.array(cookieSchema).default([]),
      dataCollected: z.array(z.string()).default([]),
    })
    .default({ subprocessors: [], cookies: [], dataCollected: [] }),
});

export type ModuleManifest = z.infer<typeof moduleManifestSchema>;
