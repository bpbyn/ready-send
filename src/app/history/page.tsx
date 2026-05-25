import {
  CalendarDays,
  ChevronRight,
  Clock3,
  SlidersHorizontal,
  UserRound,
  UsersRound,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { requests } from "@/lib/mock-data";

export default function HistoryPage() {
  return (
    <AppShell title="Sent History" active="history">
      <div className="stack">
        <div className="search-bar">
          <UserRound size={16} />
          <span>Search guests or dates...</span>
          <SlidersHorizontal size={16} />
        </div>

        <div className="filter-row" aria-label="History filters">
          <Badge tone="primary">All (8)</Badge>
          <Badge>Sent (6)</Badge>
          <Badge>Drafts (1)</Badge>
          <Badge>Failed (1)</Badge>
        </div>

        <div className="stack">
          {requests.map((request) => (
            <Card className="history-card" padded={false} key={request.id}>
              <div className="history-top">
                <div className="history-person">
                  <span className="mini-icon">
                    <UsersRound />
                  </span>
                  <div>
                    <h2 className="history-name">
                      {request.guest}
                      {request.relation ? ` (${request.relation})` : ""}
                    </h2>
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
                  <CalendarDays size={12} />
                  {request.date}
                </span>
                <span>
                  <Clock3 size={12} />
                  {request.time}
                </span>
              </div>
              <p className="hint">{request.sentAt}</p>
              <div className="history-foot">
                <Badge>{request.unit}</Badge>
                <a className="link-primary" href="/preview">
                  View Details <ChevronRight size={11} />
                </a>
              </div>
            </Card>
          ))}
        </div>

        <Button tone="tint">Load Older History</Button>
      </div>
    </AppShell>
  );
}
