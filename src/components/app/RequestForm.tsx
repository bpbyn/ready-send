"use client";

import { useState } from "react";
import {
  CalendarDays,
  Car,
  Clock3,
  Home,
  Trash2,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import { createGuestRequestAction } from "@/app/actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { SectionStep } from "@/components/ui/SectionStep";
import type { ResidentProfile } from "@/lib/types";

type GuestInput = {
  id: string;
  name: string;
  relation: string;
};

export function RequestForm({ resident }: { resident: ResidentProfile }) {
  const [guests, setGuests] = useState<GuestInput[]>([
    { id: "guest-1", name: "", relation: "" },
  ]);

  function updateGuest(id: string, key: keyof GuestInput, value: string) {
    setGuests((current) =>
      current.map((guest) => (guest.id === id ? { ...guest, [key]: value } : guest)),
    );
  }

  function addGuest() {
    setGuests((current) => [
      ...current,
      { id: `guest-${Date.now()}`, name: "", relation: "" },
    ]);
  }

  function removeGuest(id: string) {
    setGuests((current) => current.filter((guest) => guest.id !== id));
  }

  return (
    <form action={createGuestRequestAction} className="stack-lg">
      <SectionStep number={1} title="Resident Details">
        <div className="field-grid">
          <Field label="Resident Name">
            <div className="field-box">
              <UserRound />
              {resident.name}
            </div>
          </Field>
          <div className="two-col">
            <Field label="Unit Number">
              <div className="field-box">
                <Home />
                {resident.unit}
              </div>
            </Field>
            <Field label="Tower / Building">
              <div className="field-box">{resident.tower || "Not set"}</div>
            </Field>
          </div>
          <Field label="Parking Slot">
            <div className="field-box">
              <Car />
              {resident.parking || "No default parking"}
            </div>
          </Field>
        </div>
      </SectionStep>

      <SectionStep number={2} title="Visit Details">
        <div className="field-grid">
          <Field label="Visit Date" htmlFor="visit_date">
            <div className="input-shell">
              <CalendarDays />
              <input id="visit_date" name="visit_date" required type="date" />
            </div>
          </Field>
          <div className="two-col">
            <Field label="Start Time" htmlFor="start_time">
              <div className="input-shell">
                <Clock3 />
                <input id="start_time" name="start_time" required type="time" />
              </div>
            </Field>
            <Field label="End Time" htmlFor="end_time">
              <div className="input-shell">
                <Clock3 />
                <input id="end_time" name="end_time" required type="time" />
              </div>
            </Field>
          </div>
        </div>
      </SectionStep>

      <SectionStep number={3} title="Guest Details">
        <div className="field-grid">
          {guests.map((guest, index) => (
            <div className="guest-editor" key={guest.id}>
              <Field label={`Guest ${index + 1} Name`}>
                <div className="input-shell">
                  <UserRoundPlus />
                  <input
                    name="guest_name"
                    onChange={(event) => updateGuest(guest.id, "name", event.target.value)}
                    placeholder="Guest full name"
                    required={index === 0}
                    value={guest.name}
                  />
                </div>
              </Field>
              <Field label="Relation / Label">
                <input
                  className="plain-input"
                  name="guest_relation"
                  onChange={(event) => updateGuest(guest.id, "relation", event.target.value)}
                  placeholder="Mother-in-law, plumber, delivery..."
                  value={guest.relation}
                />
              </Field>
              {guests.length > 1 ? (
                <button className="icon-action danger-action" onClick={() => removeGuest(guest.id)} type="button">
                  <Trash2 size={15} />
                  Remove
                </button>
              ) : null}
            </div>
          ))}
          <button className="btn btn-tint" onClick={addGuest} type="button">
            <UserRoundPlus size={15} />
            Add Guest
          </button>
          <div className="guest-row">
            <span className="guest-main">
              <Badge tone="primary">{guests.filter((guest) => guest.name).length} guests ready</Badge>
            </span>
          </div>
        </div>
      </SectionStep>

      <SectionStep number={4} title="Optional Notes">
        <div className="field-grid">
          <Field label="Parking / Vehicle Notes">
            <textarea
              className="plain-textarea"
              name="parking_notes"
              placeholder={resident.parking || "Parking slot, vehicle plate, or delivery notes"}
            />
          </Field>
          <Field label="Notes / Special Instructions">
            <textarea
              className="plain-textarea"
              name="special_instructions"
              placeholder="Anything the condo admin or guard desk should know"
            />
          </Field>
        </div>
      </SectionStep>

      <Button type="submit">
        Save Draft & Preview
      </Button>
    </form>
  );
}
