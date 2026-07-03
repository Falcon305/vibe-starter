"use client";

import Link from "next/link";
import { useState } from "react";
import { useConsent } from "@/components/consent/consent-provider";
import { Button } from "@/components/ui/button";
import { acceptAll, consentCategories, defaultConsent, rejectAll } from "@/lib/consent/consent";
import type { ConsentState } from "@/lib/consent/types";

export function CookieBanner() {
  const { decided, ready, save } = useConsent();
  const [showPreferences, setShowPreferences] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(defaultConsent);

  if (!ready || decided) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="bg-background fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-lg"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-muted-foreground text-sm">
          We use necessary cookies to run this site. With your consent we also use analytics and
          marketing cookies. Read our{" "}
          <Link href="/cookies" className="underline">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>

        {showPreferences && (
          <fieldset className="mt-4 space-y-3">
            <legend className="sr-only">Cookie preferences</legend>
            {consentCategories.map((category) => (
              <label key={category.id} className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4"
                  checked={category.locked ? true : draft[category.id]}
                  disabled={category.locked}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, [category.id]: event.target.checked }))
                  }
                />
                <span>
                  <span className="font-medium">{category.label}</span>
                  <span className="text-muted-foreground block">{category.description}</span>
                </span>
              </label>
            ))}
          </fieldset>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={() => save(acceptAll())}>Accept all</Button>
          <Button variant="outline" onClick={() => save(rejectAll())}>
            Reject all
          </Button>
          {showPreferences ? (
            <Button variant="secondary" onClick={() => save(draft)}>
              Save choices
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setShowPreferences(true)}>
              Preferences
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
