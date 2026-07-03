import { SignUp } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center px-4 py-16">
      <SignUp />
    </main>
  );
}
