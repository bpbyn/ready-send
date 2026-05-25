import { Card } from "./Card";

type SectionStepProps = {
  number: number;
  title: string;
  children: React.ReactNode;
};

export function SectionStep({ number, title, children }: SectionStepProps) {
  return (
    <section>
      <h2 className="step-heading">
        <span className="step-number">{number}</span>
        {title}
      </h2>
      <Card>{children}</Card>
    </section>
  );
}
