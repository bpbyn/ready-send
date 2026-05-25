import { ExternalLink, Eye, Pencil, Send } from "lucide-react";
import { AppShell, BackHeaderLink } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { emailPreview } from "@/lib/mock-data";

export default function PreviewPage() {
  return (
    <AppShell
      title=""
      active="request"
      headerLink={<BackHeaderLink href="/request" label="Edit details" />}
    >
      <div className="stack-lg">
        <InfoPanel tone="success">
          <strong>PDF Built Successfully</strong>
          <br />
          Ready Send has filled Grand Tower PDF template #GT-402 with your details.
        </InfoPanel>

        <section>
          <h2 className="section-title">Outgoing Email Headers</h2>
          <Card>
            <div className="meta-row">
              <span>To:</span>
              <strong>{emailPreview.to}</strong>
            </div>
            <div className="meta-row">
              <span>From:</span>
              <strong>{emailPreview.from}</strong>
            </div>
            <div className="meta-row">
              <span>Reply-To:</span>
              <a className="link-primary" href={`mailto:${emailPreview.replyTo}`}>
                {emailPreview.replyTo}
              </a>
            </div>
            <div className="meta-row">
              <span>Subject:</span>
              <strong>{emailPreview.subject}</strong>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="section-title">Email Message Body</h2>
          <div className="email-box">{emailPreview.body}</div>
        </section>

        <section>
          <h2 className="section-title">Generated Attachment</h2>
          <div className="attachment-card">
            <span className="pdf-dot">PDF</span>
            <div className="attachment-copy">
              <strong>{emailPreview.attachment}</strong>
              <span className="hint">Generated from Grand Tower template</span>
            </div>
            <a className="link-primary" href="/preview">
              <Eye size={13} /> View
            </a>
          </div>
        </section>

        <div className="stack">
          <Button href="/success" icon={<Send size={16} />}>
            Send Email Now
          </Button>
          <Button href="/request" tone="soft" icon={<Pencil size={16} />}>
            Edit Details
          </Button>
          <p className="small-note">
            <ExternalLink size={12} /> Review before sending to the condo admin.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
