import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/supabase-auth/auth-form";
import { signup } from "@/lib/auth-supabase/actions";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <div className="mt-8">
        <AuthForm action={signup} submitLabel="Sign up" />
      </div>
      <p className="text-muted-foreground mt-4 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
