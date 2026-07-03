"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { customer } from "@/lib/db/schema/billing";
import { env } from "@/lib/env";
import { site } from "@/lib/site";
import { stripe } from "@/lib/stripe/client";

async function ensureCustomer(userId: string, email: string): Promise<string> {
  const existing = await db.select().from(customer).where(eq(customer.userId, userId));
  const found = existing[0]?.stripeCustomerId;
  if (found) return found;

  const created = await stripe.customers.create({ email });
  await db.insert(customer).values({ userId, stripeCustomerId: created.id }).onConflictDoNothing();
  return created.id;
}

export async function startCheckout() {
  const session = await requireSession();
  const customerId = await ensureCustomer(session.user.id, session.user.email);

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${site.url}/dashboard?checkout=success`,
    cancel_url: `${site.url}/dashboard?checkout=cancelled`,
  });

  if (checkout.url) redirect(checkout.url);
  redirect("/dashboard");
}

export async function openBillingPortal() {
  const session = await requireSession();
  const rows = await db.select().from(customer).where(eq(customer.userId, session.user.id));
  const customerId = rows[0]?.stripeCustomerId;
  if (!customerId) redirect("/dashboard");

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${site.url}/dashboard`,
  });
  redirect(portal.url);
}
