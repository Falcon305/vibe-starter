"use client";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export function SocialButtons({ callbackURL = "/dashboard" }: { callbackURL?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => authClient.signIn.social({ provider: "github", callbackURL })}
      >
        Continue with GitHub
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => authClient.signIn.social({ provider: "google", callbackURL })}
      >
        Continue with Google
      </Button>
    </div>
  );
}
