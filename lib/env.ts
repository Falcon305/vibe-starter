import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { generatedClientEnv, generatedRuntimeEnv, generatedServerEnv } from "@/lib/env.generated";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    ...generatedServerEnv,
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.url(),
    ...generatedClientEnv,
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    ...generatedRuntimeEnv,
  },
  emptyStringAsUndefined: true,
});
