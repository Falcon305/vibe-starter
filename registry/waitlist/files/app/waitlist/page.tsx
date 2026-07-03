import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export const metadata: Metadata = { title: "Join the waitlist" };

export default function WaitlistPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main
        id="main"
        className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-16"
      >
        <h1 className="text-3xl font-bold tracking-tight">Be the first to know</h1>
        <p className="text-muted-foreground mt-3">
          Join the waitlist and we will let you know the moment we launch.
        </p>
        <div className="mt-8">
          <WaitlistForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
