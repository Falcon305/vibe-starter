import { Button } from "@/components/ui/button";
import { openBillingPortal, startCheckout } from "@/lib/stripe/actions";

export function UpgradeButton() {
  return (
    <form action={startCheckout}>
      <Button type="submit">Upgrade</Button>
    </form>
  );
}

export function ManageBillingButton() {
  return (
    <form action={openBillingPortal}>
      <Button type="submit" variant="outline">
        Manage billing
      </Button>
    </form>
  );
}
