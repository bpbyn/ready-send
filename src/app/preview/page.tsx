import { ExternalLink, Eye, Pencil, Send } from "lucide-react";
import { generateDocumentAction, sendEmailAction } from "@/app/actions";
import { AppShell, BackHeaderLink } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { buildPreviewForRequest, getLatestRequest, getRequestById } from "@/lib/data";

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ requestId?: string; error?: string }>;
}) {
  const params = await searchParams;
  const request = params.requestId ? await getRequestById(params.requestId) : await getLatestRequest();

  if (!request) {
    return (
      <AppShell title="" active="request" headerLink={<BackHeaderLink href="/request" label="New request" />}>
        <InfoPanel>No request is ready for preview yet.</InfoPanel>
      </AppShell>
    );
  }

  const emailPreview = await buildPreviewForRequest(request, request.generatedDocument);
  const hasDocument = Boolean(request.generatedDocument);

  return (
    <AppShell
      title=""
      active="request"
      headerLink={<BackHeaderLink href="/request" label="Edit details" />}
    >
      <div className="stack-lg">
        <InfoPanel tone={params.error ? undefined : hasDocument ? "success" : "shield"}>
          <strong>{params.error ? "Email Send Failed" : hasDocument ? "PDF Built Successfully" : "Draft Saved"}</strong>
          <br />
          {params.error
            ? "The generated PDF was preserved. Review the error in history and retry when ready."
            : hasDocument
              ? "Ready Send filled the active condo PDF template with your details."
              : "Generate the completed PDF before sending this request."}
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
              <span className="hint">
                {hasDocument ? "Generated from active template" : "Not generated yet"}
              </span>
            </div>
            {request.generatedDocument?.signedUrl ? (
              <a className="link-primary" href={request.generatedDocument.signedUrl} rel="noreferrer" target="_blank">
                <Eye size={13} /> View
              </a>
            ) : (
              <span className="hint">
                <Eye size={13} /> Pending
              </span>
            )}
          </div>
        </section>

        <form className="stack" action={hasDocument ? sendEmailAction : generateDocumentAction}>
          <input name="request_id" type="hidden" value={request.id} />
          <Button icon={<Send size={16} />} type="submit">
            {hasDocument ? "Send Email Now" : "Generate PDF"}
          </Button>
          <Button href="/request" tone="soft" icon={<Pencil size={16} />}>
            Create Another Draft
          </Button>
          <p className="small-note">
            <ExternalLink size={12} /> Review before sending to the condo admin.
          </p>
        </form>
      </div>
    </AppShell>
  );
}
