"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { waitlist } from "@/lib/db/schema/waitlist";
import { sendEmail } from "@/lib/email/client";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({ email: z.email() });

export type WaitlistState = { ok: boolean; error?: string };

export async function joinWaitlist(
  _previous: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const ip = clientIp(await headers());
  if (!rateLimit(`waitlist:${ip}`, 5, 60_000)) {
    return { ok: false, error: "Too many requests. Please try again later." };
  }

  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, error: "Enter a valid email address." };
  }

  await db.insert(waitlist).values({ email: parsed.data.email }).onConflictDoNothing();
  await sendEmail({
    to: parsed.data.email,
    subject: "You are on the list",
    html: "<p>Thanks for joining the waitlist. We will be in touch.</p>",
    text: "Thanks for joining the waitlist. We will be in touch.",
  });

  return { ok: true };
}
