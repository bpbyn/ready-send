import type {
  CondoSettings,
  EmailPreview,
  GeneratedDocument,
  GuestRequest,
  ResidentProfile,
} from "./types";
import { formatDate, formatVisitWindow } from "./format";

export function createEmailPreview({
  resident,
  settings,
  request,
  document,
}: {
  resident: ResidentProfile;
  settings: CondoSettings;
  request: GuestRequest;
  document?: GeneratedDocument | null;
}): EmailPreview {
  const guests = request.guests.map((guest) => guest.name).join(", ");
  const visitDate = formatDate(request.visitDate);
  const visitTime = `${formatVisitWindow(request.visitDate, request.startTime, request.endTime).split(", ").slice(1).join(", ")}`;
  const parking = request.parkingNotes || resident.parking || "No parking requested";

  const replacements: Record<string, string> = {
    "[Resident Name]": resident.name,
    "[Unit]": `Unit ${resident.unit}`,
    "[Visit Date]": visitDate,
    "[Visit Time]": visitTime,
    "[Guests]": guests,
    "[Parking]": parking,
    "[Reply To]": resident.replyTo,
  };

  let subject = settings.subjectPattern;
  let body = settings.emailBodyTemplate;

  for (const [token, value] of Object.entries(replacements)) {
    subject = subject.replaceAll(token, value);
    body = body.replaceAll(token, value);
  }

  return {
    to: settings.adminEmail,
    from: process.env.RESEND_FROM_EMAIL ?? "Ready Send <parking@readysend.app>",
    replyTo: resident.replyTo,
    subject,
    body,
    attachment: document?.filename ?? `guest-authorization-${resident.unit.toLowerCase()}.pdf`,
  };
}
