import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { getSession } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <SignOutButton />
      </div>
      <p className="text-muted-foreground mt-4">Signed in as {session.user.email}.</p>
    </main>
  );
}
