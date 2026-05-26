import { LockKeyhole } from "lucide-react";
import { signInAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="page-backdrop">
      <div className="phone login-phone">
        <div className="app-content login-content">
          <section className="success-hero">
            <div className="check-orb">
              <LockKeyhole size={34} />
            </div>
            <h1>Ready Send</h1>
            <p>Sign in with the single admin account to manage templates and guest requests.</p>
          </section>

          <Card>
            <form action={signInAction} className="field-grid">
              <input name="next" type="hidden" value={params.next ?? "/dashboard"} />
              <Field label="Email" htmlFor="email">
                <input className="plain-input" id="email" name="email" required type="email" />
              </Field>
              <Field label="Password" htmlFor="password">
                <input className="plain-input" id="password" name="password" required type="password" />
              </Field>
              {params.error ? <p className="error-note">{params.error}</p> : null}
              <Button type="submit">Sign In</Button>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
