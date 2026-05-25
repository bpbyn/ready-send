import { CheckCircle2, TriangleAlert } from "lucide-react";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "primary" | "success" | "danger" | "neutral";
  icon?: "check" | "alert";
};

export function Badge({ children, tone = "neutral", icon }: BadgeProps) {
  const Icon = icon === "check" ? CheckCircle2 : icon === "alert" ? TriangleAlert : null;

  return (
    <span className={`badge badge-${tone}`}>
      {Icon ? <Icon size={12} /> : null}
      {children}
    </span>
  );
}
