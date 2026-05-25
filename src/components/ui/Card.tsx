type CardProps = {
  children: React.ReactNode;
  padded?: boolean;
  className?: string;
};

export function Card({ children, padded = true, className = "" }: CardProps) {
  return <section className={`card ${padded ? "card-pad" : ""} ${className}`}>{children}</section>;
}
