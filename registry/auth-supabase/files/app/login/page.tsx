import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/supabase-auth/auth-form";
import { login } from "@/lib/auth-supabase/actions";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
      <div className="mt-8">
        <AuthForm action={login} submitLabel="Sign in" />
      </div>
      <p className="text-muted-foreground mt-4 text-sm">
        No account?{" "}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </p>
    </main>
  );
}
