import { getSession } from "@/lib/auth/guard";
import { env } from "@/lib/env";

export function isAdminEmail(email: string): boolean {
  return env.ADMIN_EMAILS.split(",")
    .map((entry) => entry.trim().toLowerCase())
    .includes(email.toLowerCase());
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || !isAdminEmail(session.user.email)) {
    throw new Error("Forbidden");
  }
  return session;
}
