import type { Metadata } from "next";
import { DoNotSell } from "@/components/consent/do-not-sell";
import { ManageConsent } from "@/components/consent/manage-consent";
import { LegalDocumentView } from "@/components/legal/legal-document";
import { LegalShell } from "@/components/legal/legal-shell";
import { includesUs, legalConfig } from "@/lib/legal/config";
import { cookiePolicy } from "@/lib/legal/content";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <LegalShell>
      <div className="space-y-10">
        <LegalDocumentView document={cookiePolicy()} />

        <section id="cookie-table" className="space-y-3">
          <h2 className="text-xl font-semibold">Cookies we use</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted-foreground border-b">
                <tr>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Category</th>
                  <th className="py-2 pr-4 font-medium">Purpose</th>
                  <th className="py-2 pr-4 font-medium">Provider</th>
                  <th className="py-2 font-medium">Retention</th>
                </tr>
              </thead>
              <tbody>
                {legalConfig.cookies.map((cookie) => (
                  <tr key={cookie.name} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-mono text-xs">{cookie.name}</td>
                    <td className="py-2 pr-4 capitalize">{cookie.category}</td>
                    <td className="text-muted-foreground py-2 pr-4">{cookie.purpose}</td>
                    <td className="text-muted-foreground py-2 pr-4">{cookie.provider}</td>
                    <td className="text-muted-foreground py-2">{cookie.retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="manage" className="space-y-3">
          <h2 className="text-xl font-semibold">Manage your cookies</h2>
          <ManageConsent />
        </section>

        {includesUs(legalConfig) && (
          <section id="do-not-sell" className="space-y-3">
            <h2 className="text-xl font-semibold">Do not sell or share</h2>
            <p className="text-muted-foreground">
              California residents can opt out of the sale or sharing of personal information. Using
              this control rejects all non-essential cookies on this device.
            </p>
            <DoNotSell />
          </section>
        )}
      </div>
    </LegalShell>
  );
}
