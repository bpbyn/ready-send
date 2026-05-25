import { FileText, Mail, UserRound } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { emailPreview, resident, templateSettings } from "@/lib/mock-data";

export default function SettingsPage() {
  return (
    <AppShell title="App Settings" active="settings">
      <div className="stack-lg">
        <InfoPanel>
          These values are used to auto-fill the condo association PDF template
          and draft your emails instantly.
        </InfoPanel>

        <section>
          <h2 className="section-title section-heading">
            <UserRound size={13} /> Sender Profile
          </h2>
          <Card>
            <div className="setting-row">
              <span>Resident Name</span>
              <strong>{resident.name}</strong>
            </div>
            <div className="setting-row">
              <span>Reply-To Email</span>
              <a className="link-primary" href={`mailto:${resident.replyTo}`}>
                {resident.replyTo}
              </a>
            </div>
            <div className="setting-row">
              <span>Unit Number</span>
              <strong>{resident.unit}</strong>
            </div>
            <div className="setting-row">
              <span>Tower / Building</span>
              <strong>{resident.tower}</strong>
            </div>
            <div className="setting-row">
              <span>Parking Slot</span>
              <strong>{resident.parking}</strong>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="section-title section-heading">
            <Mail size={13} /> Email Settings
          </h2>
          <Card>
            <div className="field-grid">
              <div>
                <span className="field-label">Condo Admin Email</span>
                <div className="field-box">{emailPreview.to}</div>
              </div>
              <div>
                <span className="field-label">Default Subject Pattern</span>
                <div className="field-box">Guest Authorization Request - [Visit Date]</div>
              </div>
              <div>
                <span className="field-label">Default Email Template</span>
                <div className="email-box">
                  Dear Grand Tower Administration, Please find attached the
                  completed guest authorization PDF...
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="section-title section-heading">
            <FileText size={13} /> Template Settings
          </h2>
          <Card>
            <div className="setting-row">
              <span>Active PDF Template</span>
              <strong>{templateSettings.activeTemplate}</strong>
            </div>
            <div className="setting-row">
              <span>Template Version</span>
              <Badge tone="primary">{templateSettings.version}</Badge>
            </div>
            <div className="setting-row">
              <span>Mapping Status</span>
              <Badge tone="success" icon="check">
                {templateSettings.mappingStatus}
              </Badge>
            </div>
          </Card>
          <p className="small-note settings-upload-note">
            Need to update the condo PDF template?
            <br />
            <a className="link-primary" href="/settings">
              Upload New Blank PDF Template
            </a>
          </p>
        </section>
      </div>
    </AppShell>
  );
}
