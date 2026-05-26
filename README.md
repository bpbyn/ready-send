# Ready Send

Ready Send is a single-condo guest authorization workflow built with Next.js, Supabase, PDF generation, and Resend.

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Create a Supabase project, run `supabase/schema.sql` in the SQL editor, and fill:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

4. Create one Supabase Auth user for the single-admin login.

5. Add a Resend API key and verified sender:

```bash
RESEND_API_KEY=
RESEND_FROM_EMAIL="Ready Send <parking@yourdomain.com>"
```

6. Run the app:

```bash
pnpm dev
```

Without Supabase credentials, the app renders in demo mode so UI work can continue, but persistence, uploads, PDF storage, auth, and email sending require configured services.
