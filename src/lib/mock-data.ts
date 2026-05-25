export type ResidentProfile = {
  name: string;
  unit: string;
  tower: string;
  parking: string;
  replyTo: string;
};

export type GuestRequest = {
  id: string;
  guest: string;
  relation?: string;
  date: string;
  time: string;
  sentAt: string;
  unit: string;
  status: "sent" | "failed";
};

export type EmailPreview = {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  body: string;
  attachment: string;
};

export type TemplateSettings = {
  activeTemplate: string;
  version: string;
  mappingStatus: string;
};

export const resident: ResidentProfile = {
  name: "Brian Miller",
  unit: "Unit 14B",
  tower: "Tower A",
  parking: "Slot P-24 (Level B1)",
  replyTo: "brian.m@gmail.com",
};

export const requests: GuestRequest[] = [
  {
    id: "1",
    guest: "Sarah Miller",
    relation: "Mother-in-law",
    date: "Tomorrow, Oct 17",
    time: "10:00 AM - 4:00 PM",
    sentAt: "Sent just now",
    unit: "Unit 14B",
    status: "sent",
  },
  {
    id: "2",
    guest: "Sarah Miller",
    relation: "Mother-in-law",
    date: "Today, Oct 16",
    time: "1:00 PM - 8:00 PM",
    sentAt: "Sent 15 hours ago",
    unit: "Unit 14B",
    status: "sent",
  },
  {
    id: "3",
    guest: "John Doe",
    relation: "Plumber",
    date: "Oct 14, 2024",
    time: "9:00 AM - 12:00 PM",
    sentAt: "Sent 2 days ago",
    unit: "Unit 14B",
    status: "sent",
  },
  {
    id: "4",
    guest: "Jane & James Park",
    date: "Oct 11, 2024",
    time: "6:00 PM - 11:30 PM",
    sentAt: "Failed to send - Oct 11",
    unit: "Unit 14B",
    status: "failed",
  },
  {
    id: "5",
    guest: "David Vance",
    relation: "Electrician",
    date: "Oct 05, 2024",
    time: "2:00 PM - 5:00 PM",
    sentAt: "Sent 11 days ago",
    unit: "Unit 14B",
    status: "sent",
  },
  {
    id: "6",
    guest: "Sarah Miller",
    date: "Sep 28, 2024",
    time: "10:00 AM - 3:00 PM",
    sentAt: "Sent 2 weeks ago",
    unit: "Unit 14B",
    status: "sent",
  },
];

export const emailPreview: EmailPreview = {
  to: "admin@grandtower.com",
  from: "Sarah & Brian Miller <parking@readysend.app>",
  replyTo: resident.replyTo,
  subject: "Guest Authorization Request - Unit 14B - Oct 17",
  attachment: "guest-authorization-14b.pdf",
  body: `Dear Grand Tower Administration,

Please find attached the completed guest authorization PDF for tomorrow's visit.

* Guests: Sarah Miller, Clara Miller
* Date: Oct 17, 10:00 AM - 4:00 PM
* Vehicle Parking: Slot P-24 (Level B1)

Please reply to brian.m@gmail.com if there are any issues with this registration.

Warm regards,
Brian Miller (Unit 14B)`,
};

export const templateSettings: TemplateSettings = {
  activeTemplate: "GT-402 Authorization.pdf",
  version: "v2.4 (Latest)",
  mappingStatus: "Configured",
};
