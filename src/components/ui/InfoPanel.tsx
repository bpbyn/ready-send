import { CheckCircle2, Info, ShieldCheck } from "lucide-react";

type InfoPanelProps = {
  children: React.ReactNode;
  tone?: "info" | "success" | "shield";
};

export function InfoPanel({ children, tone = "info" }: InfoPanelProps) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "shield" ? ShieldCheck : Info;
  const className = tone === "success" ? "success-panel" : "info-panel";

  return (
    <div className={className}>
      <Icon size={16} />
      <div>{children}</div>
    </div>
  );
}
