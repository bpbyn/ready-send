type FieldProps = {
  label?: string;
  children: React.ReactNode;
  hint?: string;
};

export function Field({ label, children, hint }: FieldProps) {
  return (
    <div className="field">
      {label ? <label>{label}</label> : null}
      {children}
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}
