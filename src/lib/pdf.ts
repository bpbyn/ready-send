import { PDFDocument, PDFTextField } from "pdf-lib";
import type {
  CondoSettings,
  GuestRequest,
  PdfTemplate,
  ReadySendField,
  ResidentProfile,
} from "./types";
import { formatDate, formatVisitWindow } from "./format";

export async function detectPdfFields(buffer: ArrayBuffer) {
  const document = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const form = document.getForm();
  return form.getFields().map((field) => field.getName());
}

export function buildPdfFieldValues({
  resident,
  request,
}: {
  resident: ResidentProfile;
  settings: CondoSettings;
  request: GuestRequest;
}): Record<ReadySendField, string> {
  return {
    resident_name: resident.name,
    unit: resident.unit,
    tower: resident.tower,
    visit_date: formatDate(request.visitDate),
    visit_time: formatVisitWindow(request.visitDate, request.startTime, request.endTime),
    start_time: request.startTime,
    end_time: request.endTime,
    guests: request.guests
      .map((guest) => (guest.relation ? `${guest.name} (${guest.relation})` : guest.name))
      .join(", "),
    parking: request.parkingNotes || resident.parking,
    notes: request.specialInstructions ?? "",
    reply_to: resident.replyTo,
    generated_date: formatDate(new Date().toISOString().slice(0, 10)),
  };
}

export async function fillPdfTemplate({
  templateBytes,
  template,
  resident,
  settings,
  request,
}: {
  templateBytes: ArrayBuffer;
  template: PdfTemplate;
  resident: ResidentProfile;
  settings: CondoSettings;
  request: GuestRequest;
}) {
  const document = await PDFDocument.load(templateBytes, { ignoreEncryption: true });
  const form = document.getForm();
  const values = buildPdfFieldValues({ resident, settings, request });

  for (const mapping of template.mappings) {
    const value = values[mapping.readySendField] ?? "";
    try {
      const field = form.getField(mapping.pdfFieldName);
      if (field instanceof PDFTextField) {
        field.setText(value);
      }
    } catch {
      // A stale mapping should not prevent generation of the rest of the document.
    }
  }

  form.flatten();
  return document.save();
}
