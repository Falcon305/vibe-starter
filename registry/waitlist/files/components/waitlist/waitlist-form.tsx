"use client";

import { useActionState } from "react";
import { type WaitlistState, joinWaitlist } from "@/app/waitlist/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: WaitlistState = { ok: false };

export function WaitlistForm() {
  const [state, action, pending] = useActionState(joinWaitlist, initial);

  if (state.ok) {
    return (
      <p role="status" className="text-sm">
        You are on the list. Check your inbox for a confirmation.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1 space-y-2">
        <Label htmlFor="waitlist-email" className="sr-only">
          Email
        </Label>
        <Input
          id="waitlist-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Joining..." : "Join waitlist"}
      </Button>
      {state.error && (
        <p className="text-destructive w-full text-sm" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
