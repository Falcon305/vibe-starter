"use client";

import { useState } from "react";
import { useConsent } from "@/components/consent/consent-provider";
import { Button } from "@/components/ui/button";
import { acceptAll, consentCategories, rejectAll } from "@/lib/consent/consent";
import type { ConsentState } from "@/lib/consent/types";

function ConsentForm({
  initial,
  onSave,
}: {
  initial: ConsentState;
  onSave: (next: ConsentState) => void;
}) {
  const [draft, setDraft] = useState<ConsentState>(initial);
  const [saved, setSaved] = useState(false);

  function commit(next: ConsentState) {
    setDraft(next);
    onSave(next);
    setSaved(true);
  }

  return (
    <div className="rounded-lg border p-6">
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold">Your cookie choices</legend>
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
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={() => commit(draft)}>Save choices</Button>
        <Button variant="outline" onClick={() => commit(acceptAll())}>
          Accept all
        </Button>
        <Button variant="outline" onClick={() => commit(rejectAll())}>
          Reject all
        </Button>
      </div>
      {saved && (
        <p className="text-muted-foreground mt-3 text-sm" role="status">
          Your preferences have been saved.
        </p>
      )}
    </div>
  );
}

export function ManageConsent() {
  const { categories, ready, save } = useConsent();
  if (!ready) return null;
  return <ConsentForm initial={categories} onSave={save} />;
}
