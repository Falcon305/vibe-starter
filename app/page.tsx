import { Blocks, Scale, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description:
      "A Content Security Policy, hardened headers, and validated inputs are wired in before you write a line.",
  },
  {
    icon: Scale,
    title: "Legally complete",
    description:
      "Privacy, terms, and a compliant cookie banner, generated to match the data your app actually collects.",
  },
  {
    icon: Blocks,
    title: "Only what you need",
    description:
      "A secure base plus a library of modules. The scaffolder pulls in auth, payments, or a blog on demand.",
  },
  {
    icon: Sparkles,
    title: "Built to be prompted",
    description:
      "Keep building by describing features in plain English while the guardrails keep the code production-ready.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Ship a real website without the footguns
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg">{site.description}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/#features" className={buttonVariants({ size: "lg" })}>
              See what is included
            </Link>
            <a
              href={site.github}
              className={buttonVariants({ variant: "outline", size: "lg" })}
              rel="noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-5xl px-4 pb-24">
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card text-card-foreground rounded-lg border p-6"
              >
                <feature.icon className="h-8 w-8" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
                <p className="text-muted-foreground mt-2 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
