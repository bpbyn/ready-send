import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  tone?: "primary" | "soft" | "tint";
  icon?: React.ReactNode;
};

export function Button({ children, href, tone = "primary", icon }: ButtonProps) {
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

  return <button className={className}>{content}</button>;
}
