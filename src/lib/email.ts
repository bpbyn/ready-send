import { Resend } from "resend";
import type { EmailPreview } from "./types";

let resendClient: Resend | null = null;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }

  resendClient ??= new Resend(apiKey);
  return resendClient;
}

export async function sendGuestAuthorizationEmail({
  preview,
  attachmentBytes,
}: {
  preview: EmailPreview;
  attachmentBytes: Uint8Array;
}) {
  const resend = getResend();
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const { data, error } = await resend.emails.send({
    from: preview.from,
    to: preview.to,
    replyTo: preview.replyTo,
    subject: preview.subject,
    text: preview.body,
    attachments: [
      {
        filename: preview.attachment,
        content: Buffer.from(attachmentBytes),
      },
    ],
  });

  if (error) {
    throw new Error(error.message);
  }

  return data?.id ?? null;
}
