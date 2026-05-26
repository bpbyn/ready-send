import {
  CalendarClock,
  ChevronRight,
  Clock3,
  Home,
  Inbox,
  PlusCircle,
  Reply,
  RotateCcw,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getCondoSettings, getRequests, getResidentProfile } from "@/lib/data";
import { formatDate, formatTime } from "@/lib/format";

export default async function DashboardPage() {
  const [resident, settings, requests] = await Promise.all([
    getResidentProfile(),
    getCondoSettings(),
    getRequests(),
  ]);
  const recentRequests = requests.slice(0, 3);
  const lastRequest = requests[0];
  const quickCards = [
    {
      title: "Last Request",
      value: lastRequest?.guests[0]?.name ?? "No requests yet",
      detail: lastRequest ? `${lastRequest.status} ${formatDate(lastRequest.visitDate)}` : "Create your first guest request",
      icon: ShieldCheck,
    },
    {
      title: "Condo Admin",
      value: settings.adminEmail,
      detail: settings.condoName,
      icon: Inbox,
    },
    {
      title: "Default Reply-To",
      value: resident.replyTo,
      detail: "Resident inbox",
      icon: Reply,
    },
    {
      title: "Saved Unit",
      value: `Unit ${resident.unit} • ${resident.tower || "No tower"}`,
      detail: resident.parking || "No parking saved",
      icon: Home,
    },
  ] as const;

  return (
    <AppShell title="Ready Send" active="dashboard">
      <div className="stack-lg">
        <section className="dashboard-hero">
          <h2>Hey, Brian!</h2>
          <p>
            Need to host someone today? <strong>Swipe up</strong> to prepare
            their condo access email.
          </p>
        </section>

        <section className="access-card">
          <h3>
            This guest has your <br />
            <span>unit access</span> ready.
          </h3>
          <div className="access-visual" aria-hidden="true">
            <div className="access-map" />
            <div className="access-photo" />
          </div>
          <p>
            {lastRequest
              ? `${lastRequest.guests.map((guest) => guest.name).join(", ")} is ready for Unit ${resident.unit}.`
              : `Set up the first guest authorization for Unit ${resident.unit}.`}
          </p>
          <div className="access-meta">
            <span>Condo guest</span>
            <span>{resident.parking || "No parking"}</span>
          </div>
          <div className="access-action">
            <Button href="/request" icon={<PlusCircle size={16} />}>
              New Guest Request
            </Button>
          </div>
        </section>

        <section className="quick-grid" aria-label="Dashboard summary">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <article className="quick-card" key={card.title}>
                <div className="quick-card-icon">
                  <Icon size={16} />
                </div>
                <h3>{card.title}</h3>
                <strong>{card.value}</strong>
                <span>{card.detail}</span>
              </article>
            );
          })}
        </section>

        <section className="stack">
          <div className="recent-heading">
            <h2>
              <RotateCcw size={15} color="var(--primary)" />
              Recent Requests
            </h2>
            <a className="link-primary" href="/history">
              See All
            </a>
          </div>

          {recentRequests.map((request) => (
            <Card className="history-card" padded={false} key={request.id}>
              <div className="history-top">
                <div className="history-person">
                  <span className="mini-icon">
                    <UsersRound />
                  </span>
                  <div>
                    <h3 className="history-name">
                      {request.guests.map((guest) => guest.name).join(", ")}
                    </h3>
                  </div>
                </div>
                <Badge
                  tone={request.status === "sent" ? "success" : "danger"}
                  icon={request.status === "sent" ? "check" : "alert"}
                >
                  {request.status === "sent" ? "Sent" : "Failed"}
                </Badge>
              </div>

              <div className="history-meta">
                <span>
                  <CalendarClock size={12} />
                  {formatDate(request.visitDate)}
                </span>
                <span>
                  <Clock3 size={12} />
                  {formatTime(request.startTime)} - {formatTime(request.endTime)}
                </span>
                <span>
                  {request.latestEmail?.status === "sent" ? "Sent" : request.status}
                </span>
              </div>
              <div className="history-foot">
                <Badge>Unit {resident.unit}</Badge>
                <a className="link-primary" href={`/preview?requestId=${request.id}`}>
                  View Details <ChevronRight size={11} />
                </a>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
