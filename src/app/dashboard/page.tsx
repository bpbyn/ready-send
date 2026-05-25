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
import { emailPreview, requests, resident } from "@/lib/mock-data";

const recentRequests = requests.slice(1, 4);

const quickCards = [
  {
    title: "Last Request",
    value: "Sarah Miller",
    detail: "Sent today at 11:30 AM",
    icon: ShieldCheck,
  },
  {
    title: "Condo Admin",
    value: emailPreview.to,
    detail: "Grand Tower Residence",
    icon: Inbox,
  },
  {
    title: "Default Reply-To",
    value: resident.replyTo,
    detail: "Brian & Sarah's email",
    icon: Reply,
  },
  {
    title: "Saved Unit",
    value: "Unit 14B • Tower A",
    detail: "Slot P-24 registered",
    icon: Home,
  },
] as const;

export default function DashboardPage() {
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
            Sarah Miller is cleared for Unit 14B tomorrow with parking notes
            already attached.
          </p>
          <div className="access-meta">
            <span>Condo guest</span>
            <span>Slot P-24</span>
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
                      {request.guest}
                      {request.relation ? ` (${request.relation})` : ""}
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
                  {request.date}
                </span>
                <span>
                  <Clock3 size={12} />
                  {request.time}
                </span>
                <span>
                  {request.status === "sent" ? "Sent 10m ago" : "Failed to send"}
                </span>
              </div>
              <div className="history-foot">
                <Badge>{request.unit}</Badge>
                <a className="link-primary" href="/preview">
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
