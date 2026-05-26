import { FileText, Mail, UserRound } from "lucide-react";
import {
  generateTemplateTestAction,
  saveSettingsAction,
  saveTemplateMappingsAction,
  signOutAction,
  uploadTemplateAction,
} from "@/app/actions";
import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { getCondoSettings, getLatestTemplate, getResidentProfile } from "@/lib/data";
import { readySendFields } from "@/lib/types";

export default async function SettingsPage() {
  const [resident, settings, template] = await Promise.all([
    getResidentProfile(),
    getCondoSettings(),
    getLatestTemplate(),
  ]);
  const mappedFields = new Map(template?.mappings.map((mapping) => [mapping.pdfFieldName, mapping.readySendField]));

  return (
    <AppShell title="App Settings" active="settings">
      <div className="stack-lg">
        <InfoPanel>
          These values are used to auto-fill the condo association PDF template, generate attachments,
          and send emails through Ready Send.
        </InfoPanel>

        <section>
          <h2 className="section-title section-heading">
            <UserRound size={13} /> Sender Profile
          </h2>
          <Card>
            <form action={saveSettingsAction} className="field-grid">
              <Field label="Resident Name" htmlFor="resident_name">
                <input className="plain-input" defaultValue={resident.name} id="resident_name" name="resident_name" required />
              </Field>
              <Field label="Reply-To Email" htmlFor="reply_to_email">
                <input className="plain-input" defaultValue={resident.replyTo} id="reply_to_email" name="reply_to_email" required type="email" />
              </Field>
              <div className="two-col">
                <Field label="Unit Number" htmlFor="unit_number">
                  <input className="plain-input" defaultValue={resident.unit} id="unit_number" name="unit_number" required />
                </Field>
                <Field label="Tower / Building" htmlFor="tower">
                  <input className="plain-input" defaultValue={resident.tower} id="tower" name="tower" />
                </Field>
              </div>
              <Field label="Parking Slot" htmlFor="parking_slot">
                <input className="plain-input" defaultValue={resident.parking} id="parking_slot" name="parking_slot" />
              </Field>
              <Field label="Condo Name" htmlFor="condo_name">
                <input className="plain-input" defaultValue={settings.condoName} id="condo_name" name="condo_name" required />
              </Field>
              <Field label="Condo Admin Email" htmlFor="admin_email">
                <input className="plain-input" defaultValue={settings.adminEmail} id="admin_email" name="admin_email" required type="email" />
              </Field>
              <Field label="Default Subject Pattern" htmlFor="subject_pattern">
                <input className="plain-input" defaultValue={settings.subjectPattern} id="subject_pattern" name="subject_pattern" required />
              </Field>
              <Field label="Default Email Template" htmlFor="email_body_template">
                <textarea className="plain-textarea" defaultValue={settings.emailBodyTemplate} id="email_body_template" name="email_body_template" required />
              </Field>
              <Button type="submit">Save Settings</Button>
            </form>
          </Card>
        </section>

        <section>
          <h2 className="section-title section-heading">
            <Mail size={13} /> Current Email Settings
          </h2>
          <Card>
            <div className="setting-row">
              <span>Condo Admin Email</span>
              <strong>{settings.adminEmail}</strong>
            </div>
            <div className="setting-row">
              <span>Reply-To Email</span>
              <a className="link-primary" href={`mailto:${resident.replyTo}`}>
                {resident.replyTo}
              </a>
            </div>
            <div className="setting-row">
              <span>Subject Pattern</span>
              <strong>{settings.subjectPattern}</strong>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="section-title section-heading">
            <FileText size={13} /> Template Upload
          </h2>
          <Card>
            <form action={uploadTemplateAction} className="field-grid">
              <Field label="Blank Condo PDF Template" hint="Existing PDF form fields will be detected after upload.">
                <input accept="application/pdf" className="plain-input file-input" name="template_pdf" required type="file" />
              </Field>
              <Button type="submit">Upload & Detect Fields</Button>
            </form>
          </Card>
        </section>

        <section>
          <h2 className="section-title section-heading">
            <FileText size={13} /> Template Settings
          </h2>
          <Card>
            <div className="setting-row">
              <span>Active PDF Template</span>
              <strong>{template?.name ?? "No template uploaded"}</strong>
            </div>
            <div className="setting-row">
              <span>Template Status</span>
              <Badge tone={template?.status === "active" ? "success" : "primary"}>
                {template?.status ?? "Missing"}
              </Badge>
            </div>
            <div className="setting-row">
              <span>Mapping Status</span>
              <Badge tone={template?.mappings.length ? "success" : "primary"} icon={template?.mappings.length ? "check" : undefined}>
                {template?.mappings.length ? `${template.mappings.length} mapped` : "Not configured"}
              </Badge>
            </div>
          </Card>
          {template ? (
            <Card>
              <form action={saveTemplateMappingsAction} className="field-grid">
                <input name="template_id" type="hidden" value={template.id} />
                <p className="section-title">Detected PDF Fields ({template.detectedFields.length})</p>
                {template.detectedFields.length ? (
                  template.detectedFields.map((fieldName) => (
                    <div className="mapping-row" key={fieldName}>
                      <input name="pdf_field_name" type="hidden" value={fieldName} />
                      <span>{fieldName}</span>
                      <select className="plain-input" defaultValue={mappedFields.get(fieldName) ?? ""} name="ready_send_field">
                        <option value="">Do not fill</option>
                        {readySendFields.map((field) => (
                          <option key={field.value} value={field.value}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))
                ) : (
                  <p className="hint">No AcroForm fields were detected in this PDF.</p>
                )}
                <Button type="submit">Save Field Mapping</Button>
              </form>
              <form action={generateTemplateTestAction} className="stack">
                <input name="template_id" type="hidden" value={template.id} />
                <Button tone="soft" type="submit">Generate Test PDF & Activate</Button>
              </form>
            </Card>
          ) : null}
        </section>

        <form action={signOutAction}>
          <Button tone="soft" type="submit">Sign Out</Button>
        </form>
      </div>
    </AppShell>
  );
}
