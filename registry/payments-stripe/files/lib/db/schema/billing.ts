import { pgTable, text } from "drizzle-orm/pg-core";
import { user } from "@/lib/db/schema/auth";

export const customer = pgTable("customer", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  subscriptionId: text("subscription_id"),
  subscriptionStatus: text("subscription_status"),
  priceId: text("price_id"),
});
