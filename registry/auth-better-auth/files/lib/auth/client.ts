import { createAuthClient } from "better-auth/react";
import { authClientPlugins } from "@/lib/auth/client-plugins";
import { env } from "@/lib/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SITE_URL,
  plugins: authClientPlugins,
});

export const { signIn, signOut, signUp, useSession } = authClient;
