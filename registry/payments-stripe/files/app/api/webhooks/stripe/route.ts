import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { customer } from "@/lib/db/schema/billing";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe/client";

const subscriptionEvents = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (subscriptionEvents.has(event.type)) {
    const subscription = event.data.object as Stripe.Subscription;
    await db
      .update(customer)
      .set({
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        priceId: subscription.items.data[0]?.price.id ?? null,
      })
      .where(eq(customer.stripeCustomerId, String(subscription.customer)));
  }

  return NextResponse.json({ received: true });
}
