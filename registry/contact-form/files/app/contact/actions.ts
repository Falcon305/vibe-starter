"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { sendEmail } from "@/lib/email/client";
import { env } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  message: z.string().min(1).max(2000),
});

const escapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => escapes[character] ?? character);
}

export type ContactState = { ok: boolean; error?: string };

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const ip = clientIp(await headers());
  if (!rateLimit(`contact:${ip}`, 5, 60_000)) {
    return { ok: false, error: "Too many requests. Please try again later." };
  }

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Please check your details and try again." };
  }

  const { name, email, message } = parsed.data;
  await sendEmail({
    to: env.CONTACT_EMAIL,
    subject: `Contact form: ${name}`,
    html: `<p>From: ${escapeHtml(name)} (${escapeHtml(email)})</p><p>${escapeHtml(message)}</p>`,
    text: `From: ${name} (${email})\n\n${message}`,
  });

  return { ok: true };
}
