import { SignIn } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center px-4 py-16">
      <SignIn />
    </main>
  );
}
