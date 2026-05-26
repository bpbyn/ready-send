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
import { getRequests, getResidentProfile } from "@/lib/data";
import { formatDate, formatTime } from "@/lib/format";

export default async function HistoryPage() {
  const [requests, resident] = await Promise.all([getRequests(), getResidentProfile()]);
  const sentCount = requests.filter((request) => request.status === "sent").length;
  const draftCount = requests.filter((request) => request.status === "draft").length;
  const failedCount = requests.filter((request) => request.status === "failed").length;

  return (
    <AppShell title="Sent History" active="history">
      <div className="stack">
        <div className="search-bar">
          <UserRound size={16} />
          <span>Search guests or dates...</span>
          <SlidersHorizontal size={16} />
        </div>

        <div className="filter-row" aria-label="History filters">
          <Badge tone="primary">All ({requests.length})</Badge>
          <Badge>Sent ({sentCount})</Badge>
          <Badge>Drafts ({draftCount})</Badge>
          <Badge>Failed ({failedCount})</Badge>
        </div>

        <div className="stack">
          {!requests.length ? <Card>No guest requests have been created yet.</Card> : null}
          {requests.map((request) => (
            <Card className="history-card" padded={false} key={request.id}>
              <div className="history-top">
                <div className="history-person">
                  <span className="mini-icon">
                    <UsersRound />
                  </span>
                  <div>
                    <h2 className="history-name">
                      {request.guests.map((guest) => guest.name).join(", ")}
                    </h2>
                  </div>
                </div>
                <Badge
                  tone={request.status === "sent" ? "success" : "danger"}
                  icon={request.status === "sent" ? "check" : "alert"}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>

              <div className="history-meta">
                <span>
                  <CalendarDays size={12} />
                  {formatDate(request.visitDate)}
                </span>
                <span>
                  <Clock3 size={12} />
                  {formatTime(request.startTime)} - {formatTime(request.endTime)}
                </span>
              </div>
              <p className="hint">
                {request.latestEmail?.errorMessage ?? `Updated ${new Date(request.updatedAt).toLocaleString()}`}
              </p>
              <div className="history-foot">
                <Badge>Unit {resident.unit}</Badge>
                <a className="link-primary" href={`/preview?requestId=${request.id}`}>
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
