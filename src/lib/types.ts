export type ReadySendField =
  | "resident_name"
  | "unit"
  | "tower"
  | "visit_date"
  | "visit_time"
  | "start_time"
  | "end_time"
  | "guests"
  | "parking"
  | "notes"
  | "reply_to"
  | "generated_date";

export const readySendFields: { value: ReadySendField; label: string }[] = [
  { value: "resident_name", label: "Resident name" },
  { value: "unit", label: "Unit" },
  { value: "tower", label: "Tower / building" },
  { value: "visit_date", label: "Visit date" },
  { value: "visit_time", label: "Visit time window" },
  { value: "start_time", label: "Start time" },
  { value: "end_time", label: "End time" },
  { value: "guests", label: "Guest names" },
  { value: "parking", label: "Parking / vehicle notes" },
  { value: "notes", label: "Special instructions" },
  { value: "reply_to", label: "Reply-to email" },
  { value: "generated_date", label: "Generated date" },
];

export type ResidentProfile = {
  id: string;
  name: string;
  unit: string;
  tower: string;
  parking: string;
  replyTo: string;
};

export type CondoSettings = {
  id: string;
  condoName: string;
  adminEmail: string;
  subjectPattern: string;
  emailBodyTemplate: string;
};

export type TemplateFieldMapping = {
  id: string;
  pdfFieldName: string;
  readySendField: ReadySendField;
};

export type PdfTemplate = {
  id: string;
  name: string;
  storagePath: string;
  status: "draft" | "active" | "archived";
  detectedFields: string[];
  mappings: TemplateFieldMapping[];
  testGeneratedPath?: string | null;
  createdAt: string;
};

export type Guest = {
  id?: string;
  name: string;
  relation?: string;
};

export type GuestRequest = {
  id: string;
  guests: Guest[];
  visitDate: string;
  startTime: string;
  endTime: string;
  parkingNotes?: string;
  specialInstructions?: string;
  status: "draft" | "generated" | "sent" | "failed";
  createdAt: string;
  updatedAt: string;
};

export type GeneratedDocument = {
  id: string;
  requestId: string;
  templateId: string;
  storagePath: string;
  filename: string;
  createdAt: string;
  signedUrl?: string;
};

export type EmailSend = {
  id: string;
  requestId: string;
  generatedDocumentId?: string | null;
  providerMessageId?: string | null;
  status: "sent" | "failed";
  recipient: string;
  replyTo: string;
  subject: string;
  body: string;
  errorMessage?: string | null;
  createdAt: string;
};

export type RequestWithRelations = GuestRequest & {
  generatedDocument?: GeneratedDocument | null;
  latestEmail?: EmailSend | null;
};

export type EmailPreview = {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  body: string;
  attachment: string;
};
