import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  House,
  PlusCircle,
  RotateCcw,
  Settings,
} from "lucide-react";
import readySendLogo from "../../../logo.jpeg";
import { getResidentProfile } from "@/lib/data";

type ActiveRoute = "dashboard" | "request" | "history" | "settings";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: House, key: "dashboard" },
  { label: "Request", href: "/request", icon: PlusCircle, key: "request" },
  { label: "History", href: "/history", icon: RotateCcw, key: "history" },
  { label: "Settings", href: "/settings", icon: Settings, key: "settings" },
] as const;

type AppShellProps = {
  title: string;
  active: ActiveRoute;
  children: React.ReactNode;
  headerLink?: React.ReactNode;
  contentClassName?: string;
};

export async function AppShell({
  title,
  active,
  children,
  headerLink,
  contentClassName = "",
}: AppShellProps) {
  const resident = await getResidentProfile();
  const showBrandTagline = !headerLink && title === "Ready Send";

  return (
    <main className="page-backdrop">
      <div className="phone">
        <header className="app-header">
          <div className="brand-lockup">
            {headerLink ?? (
              <div className="brand-mark">
                <Image
                  src={readySendLogo}
                  alt=""
                  className="brand-mark-image"
                  priority
                  sizes="44px"
                />
              </div>
            )}
            <div className={`brand-copy ${showBrandTagline ? "with-tagline" : ""}`}>
              <h1 className="brand-title">
                {showBrandTagline ? (
                  <>
                    <span>Ready</span> <span className="brand-title-accent">Send</span>
                  </>
                ) : (
                  title
                )}
              </h1>
              {showBrandTagline ? (
                <p className="brand-tagline">Fill it once, send it right..</p>
              ) : null}
            </div>
          </div>
          <div className="resident-chip" aria-label={`Resident ${resident.name}`}>
            <div>
              <span>Resident</span>
              <strong>{resident.name}</strong>
            </div>
            <div className="avatar" />
          </div>
        </header>

        <div className={`app-content ${contentClassName}`}>{children}</div>

        <nav className="bottom-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className={`nav-item ${active === item.key ? "active" : ""}`}
                href={item.href}
                key={item.key}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </main>
  );
}

export function BackHeaderLink({ href, label }: { href: string; label: string }) {
  return (
    <Link className="back-link" href={href}>
      <ChevronLeft size={15} />
      {label}
    </Link>
  );
}
