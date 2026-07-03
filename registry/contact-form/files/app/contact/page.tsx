import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-xl flex-1 px-4 py-16">
        <h1 className="text-2xl font-bold tracking-tight">Contact us</h1>
        <p className="text-muted-foreground mt-2">We will get back to you soon.</p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
