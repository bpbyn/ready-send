import type {
  CondoSettings,
  EmailPreview,
  PdfTemplate,
  RequestWithRelations,
  ResidentProfile,
} from "./types";

export const demoResident: ResidentProfile = {
  id: "demo-resident",
  name: "Brian Miller",
  unit: "14B",
  tower: "Tower A",
  parking: "Slot P-24 (Level B1)",
  replyTo: "brian.m@gmail.com",
};

export const demoSettings: CondoSettings = {
  id: "demo-settings",
  condoName: "Grand Tower Residence",
  adminEmail: "admin@grandtower.com",
  subjectPattern: "Guest Authorization Request - [Unit] - [Visit Date]",
  emailBodyTemplate: `Dear Grand Tower Administration,

Please find attached the completed guest authorization PDF for [Visit Date].

Guests: [Guests]
Visit window: [Visit Time]
Vehicle/Parking: [Parking]

Please reply to [Reply To] if there are any issues with this registration.

Warm regards,
[Resident Name] ([Unit])`,
};

export const demoTemplate: PdfTemplate = {
  id: "demo-template",
  name: "GT-402 Authorization.pdf",
  storagePath: "demo/gt-402.pdf",
  status: "draft",
  detectedFields: [
    "resident_name",
    "unit_number",
    "visit_date",
    "visit_time",
    "guest_names",
    "parking_notes",
    "reply_to",
  ],
  mappings: [
    { id: "m1", pdfFieldName: "resident_name", readySendField: "resident_name" },
    { id: "m2", pdfFieldName: "unit_number", readySendField: "unit" },
    { id: "m3", pdfFieldName: "visit_date", readySendField: "visit_date" },
    { id: "m4", pdfFieldName: "visit_time", readySendField: "visit_time" },
    { id: "m5", pdfFieldName: "guest_names", readySendField: "guests" },
    { id: "m6", pdfFieldName: "parking_notes", readySendField: "parking" },
    { id: "m7", pdfFieldName: "reply_to", readySendField: "reply_to" },
  ],
  createdAt: new Date().toISOString(),
};

export const demoRequests: RequestWithRelations[] = [
  {
    id: "demo-request-1",
    guests: [
      { id: "g1", name: "Sarah Miller", relation: "Mother-in-law" },
      { id: "g2", name: "Clara Miller", relation: "Sister" },
    ],
    visitDate: "2026-05-27",
    startTime: "10:00",
    endTime: "16:00",
    parkingNotes: "Slot P-24 (Level B1)",
    specialInstructions: "Please allow delivery vehicle to drop off boxes near building entrance.",
    status: "sent",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    generatedDocument: {
      id: "demo-doc-1",
      requestId: "demo-request-1",
      templateId: "demo-template",
      storagePath: "demo/generated.pdf",
      filename: "guest-authorization-14b.pdf",
      createdAt: new Date().toISOString(),
    },
    latestEmail: {
      id: "demo-send-1",
      requestId: "demo-request-1",
      generatedDocumentId: "demo-doc-1",
      providerMessageId: "demo-message",
      status: "sent",
      recipient: demoSettings.adminEmail,
      replyTo: demoResident.replyTo,
      subject: "Guest Authorization Request - Unit 14B - May 27, 2026",
      body: "Demo email body",
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: "demo-request-2",
    guests: [{ id: "g3", name: "John Doe", relation: "Plumber" }],
    visitDate: "2026-05-24",
    startTime: "09:00",
    endTime: "12:00",
    parkingNotes: "",
    specialInstructions: "",
    status: "failed",
    createdAt: "2026-05-24T02:00:00.000Z",
    updatedAt: "2026-05-24T02:00:00.000Z",
    latestEmail: {
      id: "demo-send-2",
      requestId: "demo-request-2",
      status: "failed",
      recipient: demoSettings.adminEmail,
      replyTo: demoResident.replyTo,
      subject: "Guest Authorization Request - Unit 14B - May 24, 2026",
      body: "Demo email body",
      errorMessage: "Demo failed send",
      createdAt: "2026-05-24T02:00:00.000Z",
    },
  },
];

export const demoEmailPreview: EmailPreview = {
  to: demoSettings.adminEmail,
  from: process.env.RESEND_FROM_EMAIL ?? "Ready Send <parking@readysend.app>",
  replyTo: demoResident.replyTo,
  subject: "Guest Authorization Request - Unit 14B - May 27, 2026",
  attachment: "guest-authorization-14b.pdf",
  body: `Dear Grand Tower Administration,

Please find attached the completed guest authorization PDF for May 27, 2026.

Guests: Sarah Miller, Clara Miller
Visit window: 10:00 AM - 4:00 PM
Vehicle/Parking: Slot P-24 (Level B1)

Please reply to brian.m@gmail.com if there are any issues with this registration.

Warm regards,
Brian Miller (Unit 14B)`,
};
