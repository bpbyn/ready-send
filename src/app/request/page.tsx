import {
  Building2,
  CalendarDays,
  Car,
  ChevronDown,
  Clock3,
  Home,
  Trash2,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import { AppShell, BackHeaderLink } from "@/components/app/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { SectionStep } from "@/components/ui/SectionStep";
import { resident } from "@/lib/mock-data";

export default function RequestPage() {
  return (
    <AppShell
      title=""
      active="request"
      headerLink={<BackHeaderLink href="/history" label="Dashboard" />}
      contentClassName="tight"
    >
      <div className="stack-lg">
        <InfoPanel tone="shield">
          <strong>PDF Authorization Builder</strong>
          <br />
          Fill out the form below. We will auto-fill your condo&apos;s official
          PDF form and pre-draft the email.
        </InfoPanel>

        <SectionStep number={1} title="Resident Details">
          <div className="field-grid">
            <Field
              label="Resident Name"
              hint="The official unit owner or tenant registered name"
            >
              <div className="field-box">
                <UserRound />
                {resident.name}
              </div>
            </Field>
            <div className="two-col">
              <Field label="Unit Number">
                <div className="field-box">
                  <Home />
                  14B
                </div>
              </Field>
              <Field label="Tower / Building">
                <div className="field-box">
                  <Building2 />
                  Tower A
                  <ChevronDown className="push-right" size={14} />
                </div>
              </Field>
            </div>
            <Field
              label="Parking Slot"
              hint="Optional - leave blank if no guest parking is required"
            >
              <div className="field-box">
                <Car />
                {resident.parking}
              </div>
            </Field>
          </div>
        </SectionStep>

        <SectionStep number={2} title="Visit Details">
          <div className="field-grid">
            <Field label="Visit Date">
              <div className="field-box">
                <CalendarDays />
                Tomorrow, October 17, 2024
              </div>
            </Field>
            <div className="two-col">
              <Field label="Start Time">
                <div className="field-box">
                  <Clock3 />
                  10:00 AM
                  <ChevronDown className="push-right" size={14} />
                </div>
              </Field>
              <Field label="End Time">
                <div className="field-box">
                  <Clock3 />
                  4:00 PM
                  <ChevronDown className="push-right" size={14} />
                </div>
              </Field>
            </div>
          </div>
        </SectionStep>

        <SectionStep number={3} title="Guest Details">
          <div className="field-grid">
            <Field label="Add Guest Name">
              <div className="field-box muted">
                <UserRoundPlus />
                Type guest&apos;s full name
              </div>
            </Field>
            <Button tone="tint" icon={<UserRoundPlus size={15} />}>
              Add Guest
            </Button>
            <div>
              <p className="section-title">Added Guests (2)</p>
              <div className="guest-row">
                <span className="guest-main">
                  <Badge tone="success" icon="check">
                    Sarah Miller
                  </Badge>
                  <span className="tag">Mother-in-law</span>
                </span>
                <Trash2 color="var(--danger)" size={15} />
              </div>
              <div className="guest-row">
                <span className="guest-main">
                  <Badge tone="success" icon="check">
                    Clara Miller
                  </Badge>
                  <span className="tag">Sister</span>
                </span>
                <Trash2 color="var(--danger)" size={15} />
              </div>
            </div>
          </div>
        </SectionStep>

        <SectionStep number={4} title="Optional Notes">
          <Field label="Notes / Special Instructions">
            <div className="field-box muted note-box">
              Please allow delivery vehicle to drop off boxes near building
              entrance before heading to slot P-24.
            </div>
          </Field>
        </SectionStep>
      </div>
    </AppShell>
  );
}
