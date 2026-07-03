import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

export type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

export async function sendEmail(params: SendEmailParams) {
  return resend.emails.send({
    from: params.from ?? env.EMAIL_FROM,
    to: params.to,
    subject: params.subject,
    html: params.html,
    ...(params.text ? { text: params.text } : {}),
  });
}
