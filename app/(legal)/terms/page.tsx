import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/legal-document";
import { LegalShell } from "@/components/legal/legal-shell";
import { termsOfService } from "@/lib/legal/content";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalShell>
      <LegalDocumentView document={termsOfService()} />
    </LegalShell>
  );
}
