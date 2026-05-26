import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  tone?: "primary" | "soft" | "tint";
  icon?: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  formAction?: (formData: FormData) => void | Promise<void>;
};

export function Button({
  children,
  href,
  tone = "primary",
  icon,
  type = "button",
  disabled = false,
  formAction,
}: ButtonProps) {
  const className = `btn btn-${tone}`;
  const content = (
    <>
      {icon}
      {children}
    </>
  );

  if (href) {
    return (
      <Link className={className} href={href}>
        {content}
      </Link>
    );
  }

  return (
    <button className={className} disabled={disabled} formAction={formAction} type={type}>
      {content}
    </button>
  );
}
