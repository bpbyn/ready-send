import { AppShell, BackHeaderLink } from "@/components/app/AppShell";
import { RequestForm } from "@/components/app/RequestForm";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { getActiveTemplate, getResidentProfile } from "@/lib/data";

export default async function RequestPage() {
  const [resident, activeTemplate] = await Promise.all([getResidentProfile(), getActiveTemplate()]);

  return (
    <AppShell
      title=""
      active="request"
      headerLink={<BackHeaderLink href="/history" label="Dashboard" />}
      contentClassName="tight"
    >
      <div className="stack-lg">
        <InfoPanel tone={activeTemplate ? "shield" : undefined}>
          <strong>PDF Authorization Builder</strong>
          <br />
          {activeTemplate
            ? "Fill out the form below. We will auto-fill your condo's official PDF form and pre-draft the email."
            : "Save the guest details now. Upload, map, and test a PDF template in Settings before generating the final PDF."}
        </InfoPanel>
        <RequestForm resident={resident} />
      </div>
    </AppShell>
  );
}
