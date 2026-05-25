import { Check, PlusCircle, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { emailPreview, resident } from "@/lib/mock-data";

export default function SuccessPage() {
  return (
    <AppShell title="Ready Send" active="dashboard">
      <div className="stack-lg">
        <section className="success-hero">
          <div className="check-orb">
            <Check size={38} strokeWidth={2.5} />
          </div>
          <h1>Email Sent Successfully</h1>
          <p>
            Your guest authorization request and completed PDF was sent to your
            condo administrator.
          </p>
        </section>

        <Card>
          <div className="meta-row">
            <span>Recipient:</span>
            <strong>{emailPreview.to}</strong>
          </div>
          <div className="meta-row">
            <span>Template Filled:</span>
            <strong>Form #GT-402</strong>
          </div>
          <div className="meta-row">
            <span>Reply-to set to:</span>
            <strong>{resident.replyTo}</strong>
          </div>
          <div className="meta-row">
            <span>Timestamp:</span>
            <Badge tone="success">Just now</Badge>
          </div>
        </Card>

        <InfoReplyNote />

        <div className="stack">
          <Button href="/request" icon={<PlusCircle size={16} />}>
            Create Another Request
          </Button>
          <Button href="/history" tone="soft" icon={<RotateCcw size={16} />}>
            View Sent History
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function InfoReplyNote() {
  return (
    <div className="info-panel centered-info">
      <p className="small-note">
        Replies from the condo admin will arrive directly in your personal
        {` ${resident.replyTo} `}inbox.
      </p>
    </div>
  );
}
