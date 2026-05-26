import { randomUUID } from "crypto";
import {
  demoEmailPreview,
  demoRequests,
  demoResident,
  demoSettings,
  demoTemplate,
} from "./demo-data";
import { createEmailPreview } from "./email-preview";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
  hasSupabaseConfig,
} from "./supabase/server";
import type {
  CondoSettings,
  EmailPreview,
  EmailSend,
  GeneratedDocument,
  Guest,
  GuestRequest,
  PdfTemplate,
  ReadySendField,
  RequestWithRelations,
  ResidentProfile,
  TemplateFieldMapping,
} from "./types";

const TEMPLATE_BUCKET = "pdf-templates";
const DOCUMENT_BUCKET = "generated-documents";

type SupabaseClientLike = Awaited<ReturnType<typeof createSupabaseServerClient>>;

async function getDbClient() {
  return createSupabaseAdminClient() ?? (await createSupabaseServerClient());
}

function isConfigured() {
  return hasSupabaseConfig();
}

function requireClient(client: SupabaseClientLike) {
  if (!client) {
    throw new Error("Supabase is not configured. Add environment variables from .env.example.");
  }
  return client;
}

function mapResident(row: Record<string, unknown>): ResidentProfile {
  return {
    id: String(row.id),
    name: String(row.resident_name ?? ""),
    unit: String(row.unit_number ?? ""),
    tower: String(row.tower ?? ""),
    parking: String(row.parking_slot ?? ""),
    replyTo: String(row.reply_to_email ?? ""),
  };
}

function mapSettings(row: Record<string, unknown>): CondoSettings {
  return {
    id: String(row.id),
    condoName: String(row.condo_name ?? ""),
    adminEmail: String(row.admin_email ?? ""),
    subjectPattern: String(row.subject_pattern ?? ""),
    emailBodyTemplate: String(row.email_body_template ?? ""),
  };
}

function mapTemplate(row: Record<string, unknown>, mappings: TemplateFieldMapping[] = []): PdfTemplate {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    storagePath: String(row.storage_path ?? ""),
    status: (row.status as PdfTemplate["status"]) ?? "draft",
    detectedFields: Array.isArray(row.detected_fields) ? (row.detected_fields as string[]) : [],
    mappings,
    testGeneratedPath: row.test_generated_path ? String(row.test_generated_path) : null,
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

function mapMapping(row: Record<string, unknown>): TemplateFieldMapping {
  return {
    id: String(row.id),
    pdfFieldName: String(row.pdf_field_name),
    readySendField: row.ready_send_field as ReadySendField,
  };
}

function mapGuest(row: Record<string, unknown>): Guest {
  return {
    id: String(row.id),
    name: String(row.guest_name),
    relation: row.relation ? String(row.relation) : undefined,
  };
}

function mapRequest(row: Record<string, unknown>, guests: Guest[]): GuestRequest {
  return {
    id: String(row.id),
    guests,
    visitDate: String(row.visit_date),
    startTime: String(row.start_time).slice(0, 5),
    endTime: String(row.end_time).slice(0, 5),
    parkingNotes: row.parking_notes ? String(row.parking_notes) : "",
    specialInstructions: row.special_instructions ? String(row.special_instructions) : "",
    status: (row.status as GuestRequest["status"]) ?? "draft",
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

function mapDocument(row: Record<string, unknown>): GeneratedDocument {
  return {
    id: String(row.id),
    requestId: String(row.request_id),
    templateId: String(row.template_id),
    storagePath: String(row.storage_path),
    filename: String(row.filename),
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

function mapEmail(row: Record<string, unknown>): EmailSend {
  return {
    id: String(row.id),
    requestId: String(row.request_id),
    generatedDocumentId: row.generated_document_id ? String(row.generated_document_id) : null,
    providerMessageId: row.provider_message_id ? String(row.provider_message_id) : null,
    status: row.status as EmailSend["status"],
    recipient: String(row.recipient),
    replyTo: String(row.reply_to),
    subject: String(row.subject),
    body: String(row.body),
    errorMessage: row.error_message ? String(row.error_message) : null,
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

export async function getResidentProfile() {
  if (!isConfigured()) return demoResident;
  const client = requireClient(await getDbClient());
  const { data, error } = await client.from("resident_profile").select("*").limit(1).maybeSingle();
  if (error) throw error;
  return data ? mapResident(data) : demoResident;
}

export async function getCondoSettings() {
  if (!isConfigured()) return demoSettings;
  const client = requireClient(await getDbClient());
  const { data, error } = await client.from("condo_settings").select("*").limit(1).maybeSingle();
  if (error) throw error;
  return data ? mapSettings(data) : demoSettings;
}

export async function updateResidentAndSettings(formData: FormData) {
  const resident = {
    resident_name: String(formData.get("resident_name") ?? "").trim(),
    unit_number: String(formData.get("unit_number") ?? "").trim(),
    tower: String(formData.get("tower") ?? "").trim(),
    parking_slot: String(formData.get("parking_slot") ?? "").trim(),
    reply_to_email: String(formData.get("reply_to_email") ?? "").trim(),
    updated_at: new Date().toISOString(),
  };
  const settings = {
    condo_name: String(formData.get("condo_name") ?? "").trim(),
    admin_email: String(formData.get("admin_email") ?? "").trim(),
    subject_pattern: String(formData.get("subject_pattern") ?? "").trim(),
    email_body_template: String(formData.get("email_body_template") ?? "").trim(),
    updated_at: new Date().toISOString(),
  };

  if (!resident.resident_name || !resident.unit_number || !resident.reply_to_email) {
    throw new Error("Resident name, unit, and reply-to email are required.");
  }
  if (!settings.condo_name || !settings.admin_email || !settings.subject_pattern) {
    throw new Error("Condo name, admin email, and subject pattern are required.");
  }

  const client = requireClient(await getDbClient());
  const existingResident = await getResidentProfile();
  const existingSettings = await getCondoSettings();

  await client.from("resident_profile").upsert({ id: existingResident.id, ...resident });
  await client.from("condo_settings").upsert({ id: existingSettings.id, ...settings });
}

export async function getActiveTemplate() {
  if (!isConfigured()) return demoTemplate;
  const client = requireClient(await getDbClient());
  const { data, error } = await client
    .from("pdf_templates")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return getTemplateById(String(data.id));
}

export async function getLatestTemplate() {
  if (!isConfigured()) return demoTemplate;
  const client = requireClient(await getDbClient());
  const { data, error } = await client
    .from("pdf_templates")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return getTemplateById(String(data.id));
}

export async function getTemplateById(id: string) {
  if (!isConfigured()) return demoTemplate;
  const client = requireClient(await getDbClient());
  const [{ data: template, error: templateError }, { data: mappings, error: mappingError }] =
    await Promise.all([
      client.from("pdf_templates").select("*").eq("id", id).maybeSingle(),
      client.from("template_fields").select("*").eq("template_id", id).order("pdf_field_name"),
    ]);
  if (templateError) throw templateError;
  if (mappingError) throw mappingError;
  return template ? mapTemplate(template, (mappings ?? []).map(mapMapping)) : null;
}

export async function uploadTemplateFile(file: File, detectedFields: string[]) {
  const client = requireClient(await getDbClient());
  const bytes = await file.arrayBuffer();
  const id = randomUUID();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
  const storagePath = `${id}/${safeName}`;

  const upload = await client.storage.from(TEMPLATE_BUCKET).upload(storagePath, bytes, {
    contentType: file.type || "application/pdf",
    upsert: false,
  });
  if (upload.error) throw upload.error;

  await client.from("pdf_templates").update({ status: "archived" }).neq("status", "archived");

  const { data, error } = await client
    .from("pdf_templates")
    .insert({
      id,
      name: file.name,
      storage_path: storagePath,
      status: "draft",
      detected_fields: detectedFields,
    })
    .select("*")
    .single();
  if (error) throw error;
  await client.from("audit_logs").insert({
    event_type: "template_uploaded",
    entity_id: id,
    metadata: { detectedFields },
  });
  return mapTemplate(data);
}

export async function saveTemplateMappings(templateId: string, mappings: { pdfFieldName: string; readySendField: ReadySendField }[]) {
  const client = requireClient(await getDbClient());
  await client.from("template_fields").delete().eq("template_id", templateId);
  if (mappings.length) {
    const { error } = await client.from("template_fields").insert(
      mappings.map((mapping) => ({
        template_id: templateId,
        pdf_field_name: mapping.pdfFieldName,
        ready_send_field: mapping.readySendField,
      })),
    );
    if (error) throw error;
  }
  await client.from("audit_logs").insert({
    event_type: "template_mapping_saved",
    entity_id: templateId,
    metadata: { mappingCount: mappings.length },
  });
}

export async function activateTemplate(templateId: string, testGeneratedPath: string) {
  const client = requireClient(await getDbClient());
  await client.from("pdf_templates").update({ status: "archived" }).neq("id", templateId);
  const { error } = await client
    .from("pdf_templates")
    .update({ status: "active", test_generated_path: testGeneratedPath, updated_at: new Date().toISOString() })
    .eq("id", templateId);
  if (error) throw error;
}

export async function downloadTemplateBytes(template: PdfTemplate) {
  const client = requireClient(await getDbClient());
  const { data, error } = await client.storage.from(TEMPLATE_BUCKET).download(template.storagePath);
  if (error) throw error;
  return data.arrayBuffer();
}

export async function uploadGeneratedDocument({
  requestId,
  templateId,
  filename,
  bytes,
  isTest = false,
}: {
  requestId: string;
  templateId: string;
  filename: string;
  bytes: Uint8Array;
  isTest?: boolean;
}) {
  const client = requireClient(await getDbClient());
  const storagePath = `${isTest ? "tests" : requestId}/${filename}`;
  const upload = await client.storage.from(DOCUMENT_BUCKET).upload(storagePath, bytes, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (upload.error) throw upload.error;

  if (isTest) {
    return {
      id: "test-document",
      requestId,
      templateId,
      storagePath,
      filename,
      createdAt: new Date().toISOString(),
    };
  }

  const { data, error } = await client
    .from("generated_documents")
    .insert({
      request_id: requestId,
      template_id: templateId,
      storage_path: storagePath,
      filename,
    })
    .select("*")
    .single();
  if (error) throw error;
  await client.from("guest_requests").update({ status: "generated", updated_at: new Date().toISOString() }).eq("id", requestId);
  return mapDocument(data);
}

export async function downloadGeneratedDocumentBytes(document: GeneratedDocument) {
  const client = requireClient(await getDbClient());
  const { data, error } = await client.storage.from(DOCUMENT_BUCKET).download(document.storagePath);
  if (error) throw error;
  return new Uint8Array(await data.arrayBuffer());
}

export async function getDocumentSignedUrl(document: GeneratedDocument) {
  if (!isConfigured()) return null;
  const client = requireClient(await getDbClient());
  const { data, error } = await client.storage.from(DOCUMENT_BUCKET).createSignedUrl(document.storagePath, 60 * 10);
  if (error) return null;
  return data.signedUrl;
}

export async function createGuestRequest(formData: FormData) {
  const guests = formData
    .getAll("guest_name")
    .map((name, index) => ({
      name: String(name).trim(),
      relation: String(formData.getAll("guest_relation")[index] ?? "").trim(),
    }))
    .filter((guest) => guest.name);

  const visitDate = String(formData.get("visit_date") ?? "");
  const startTime = String(formData.get("start_time") ?? "");
  const endTime = String(formData.get("end_time") ?? "");
  const parkingNotes = String(formData.get("parking_notes") ?? "").trim();
  const specialInstructions = String(formData.get("special_instructions") ?? "").trim();

  if (!guests.length) throw new Error("Add at least one guest.");
  if (!visitDate || !startTime || !endTime) throw new Error("Visit date, start time, and end time are required.");

  const client = requireClient(await getDbClient());
  const { data, error } = await client
    .from("guest_requests")
    .insert({
      visit_date: visitDate,
      start_time: startTime,
      end_time: endTime,
      parking_notes: parkingNotes,
      special_instructions: specialInstructions,
      status: "draft",
    })
    .select("*")
    .single();
  if (error) throw error;

  const requestId = String(data.id);
  const { error: guestsError } = await client.from("request_guests").insert(
    guests.map((guest) => ({
      request_id: requestId,
      guest_name: guest.name,
      relation: guest.relation,
    })),
  );
  if (guestsError) throw guestsError;
  return requestId;
}

export async function getRequests() {
  if (!isConfigured()) return demoRequests;
  const client = requireClient(await getDbClient());
  const { data: rows, error } = await client
    .from("guest_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return Promise.all((rows ?? []).map((row) => getRequestById(String(row.id)))).then((items) =>
    items.filter(Boolean) as RequestWithRelations[],
  );
}

export async function getRequestById(id: string) {
  if (!isConfigured()) return demoRequests.find((request) => request.id === id) ?? demoRequests[0];
  const client = requireClient(await getDbClient());
  const [
    { data: requestRow, error: requestError },
    { data: guests, error: guestsError },
    { data: documentRow, error: documentError },
    { data: emailRow, error: emailError },
  ] = await Promise.all([
    client.from("guest_requests").select("*").eq("id", id).maybeSingle(),
    client.from("request_guests").select("*").eq("request_id", id).order("created_at"),
    client.from("generated_documents").select("*").eq("request_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    client.from("email_sends").select("*").eq("request_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (requestError) throw requestError;
  if (guestsError) throw guestsError;
  if (documentError) throw documentError;
  if (emailError) throw emailError;
  if (!requestRow) return null;
  const request = mapRequest(requestRow, (guests ?? []).map(mapGuest)) as RequestWithRelations;
  request.generatedDocument = documentRow ? mapDocument(documentRow) : null;
  request.latestEmail = emailRow ? mapEmail(emailRow) : null;
  if (request.generatedDocument) {
    request.generatedDocument.signedUrl = (await getDocumentSignedUrl(request.generatedDocument)) ?? undefined;
  }
  return request;
}

export async function getLatestRequest() {
  const requests = await getRequests();
  return requests[0] ?? null;
}

export async function buildPreviewForRequest(request: GuestRequest, document?: GeneratedDocument | null): Promise<EmailPreview> {
  if (!isConfigured()) return demoEmailPreview;
  const [resident, settings] = await Promise.all([getResidentProfile(), getCondoSettings()]);
  return createEmailPreview({ resident, settings, request, document });
}

export async function recordEmailSend({
  requestId,
  generatedDocumentId,
  providerMessageId,
  status,
  recipient,
  replyTo,
  subject,
  body,
  errorMessage,
}: Omit<EmailSend, "id" | "createdAt">) {
  const client = requireClient(await getDbClient());
  const { error } = await client.from("email_sends").insert({
    request_id: requestId,
    generated_document_id: generatedDocumentId,
    provider_message_id: providerMessageId,
    status,
    recipient,
    reply_to: replyTo,
    subject,
    body,
    error_message: errorMessage,
  });
  if (error) throw error;
  await client
    .from("guest_requests")
    .update({ status: status === "sent" ? "sent" : "failed", updated_at: new Date().toISOString() })
    .eq("id", requestId);
  await client.from("audit_logs").insert({
    event_type: status === "sent" ? "email_sent" : "email_failed",
    entity_id: requestId,
    metadata: { providerMessageId, errorMessage },
  });
}
