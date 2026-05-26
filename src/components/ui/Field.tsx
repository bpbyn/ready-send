type FieldProps = {
  label?: string;
  children: React.ReactNode;
  hint?: string;
  htmlFor?: string;
};

export function Field({ label, children, hint, htmlFor }: FieldProps) {
  return (
    <div className="field">
      {label ? <label htmlFor={htmlFor}>{label}</label> : null}
      {children}
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}
