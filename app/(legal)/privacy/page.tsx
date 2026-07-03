import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/legal-document";
import { LegalShell } from "@/components/legal/legal-shell";
import { privacyPolicy } from "@/lib/legal/content";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalShell>
      <LegalDocumentView document={privacyPolicy()} />
    </LegalShell>
  );
}
