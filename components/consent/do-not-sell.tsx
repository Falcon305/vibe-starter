"use client";

import { useState } from "react";
import { useConsent } from "@/components/consent/consent-provider";
import { Button } from "@/components/ui/button";
import { rejectAll } from "@/lib/consent/consent";

export function DoNotSell() {
  const { save, ready } = useConsent();
  const [done, setDone] = useState(false);

  if (!ready) return null;

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        onClick={() => {
          save(rejectAll());
          setDone(true);
        }}
      >
        Do Not Sell or Share My Personal Information
      </Button>
      {done && (
        <p className="text-muted-foreground text-sm" role="status">
          You have opted out. Non-essential cookies are now disabled.
        </p>
      )}
    </div>
  );
}
