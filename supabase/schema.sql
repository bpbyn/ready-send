create extension if not exists "pgcrypto";

create table if not exists resident_profile (
  id uuid primary key default gen_random_uuid(),
  resident_name text not null,
  unit_number text not null,
  tower text,
  parking_slot text,
  reply_to_email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists condo_settings (
  id uuid primary key default gen_random_uuid(),
  condo_name text not null,
  admin_email text not null,
  subject_pattern text not null,
  email_body_template text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pdf_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  storage_path text not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  detected_fields jsonb not null default '[]'::jsonb,
  test_generated_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists template_fields (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references pdf_templates(id) on delete cascade,
  pdf_field_name text not null,
  ready_send_field text not null,
  created_at timestamptz not null default now(),
  unique (template_id, pdf_field_name)
);

create table if not exists guest_requests (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'draft' check (status in ('draft', 'generated', 'sent', 'failed')),
  visit_date date not null,
  start_time time not null,
  end_time time not null,
  parking_notes text,
  special_instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists request_guests (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references guest_requests(id) on delete cascade,
  guest_name text not null,
  relation text,
  created_at timestamptz not null default now()
);

create table if not exists generated_documents (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references guest_requests(id) on delete cascade,
  template_id uuid not null references pdf_templates(id),
  storage_path text not null,
  filename text not null,
  created_at timestamptz not null default now()
);

create table if not exists email_sends (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references guest_requests(id) on delete cascade,
  generated_document_id uuid references generated_documents(id),
  provider_message_id text,
  status text not null check (status in ('sent', 'failed')),
  recipient text not null,
  reply_to text not null,
  subject text not null,
  body text not null,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into resident_profile (resident_name, unit_number, tower, parking_slot, reply_to_email)
select 'Brian Miller', '14B', 'Tower A', 'Slot P-24 (Level B1)', 'brian.m@gmail.com'
where not exists (select 1 from resident_profile);

insert into condo_settings (condo_name, admin_email, subject_pattern, email_body_template)
select
  'Grand Tower Residence',
  'admin@grandtower.com',
  'Guest Authorization Request - [Unit] - [Visit Date]',
  'Dear Grand Tower Administration,

Please find attached the completed guest authorization PDF for [Visit Date].

Guests: [Guests]
Visit window: [Visit Time]
Vehicle/Parking: [Parking]

Please reply to [Reply To] if there are any issues with this registration.

Warm regards,
[Resident Name] ([Unit])'
where not exists (select 1 from condo_settings);

alter table resident_profile enable row level security;
alter table condo_settings enable row level security;
alter table pdf_templates enable row level security;
alter table template_fields enable row level security;
alter table guest_requests enable row level security;
alter table request_guests enable row level security;
alter table generated_documents enable row level security;
alter table email_sends enable row level security;
alter table audit_logs enable row level security;

create policy "authenticated read resident profile" on resident_profile for select to authenticated using (true);
create policy "authenticated write resident profile" on resident_profile for all to authenticated using (true) with check (true);
create policy "authenticated read condo settings" on condo_settings for select to authenticated using (true);
create policy "authenticated write condo settings" on condo_settings for all to authenticated using (true) with check (true);
create policy "authenticated read templates" on pdf_templates for select to authenticated using (true);
create policy "authenticated write templates" on pdf_templates for all to authenticated using (true) with check (true);
create policy "authenticated read mappings" on template_fields for select to authenticated using (true);
create policy "authenticated write mappings" on template_fields for all to authenticated using (true) with check (true);
create policy "authenticated read requests" on guest_requests for select to authenticated using (true);
create policy "authenticated write requests" on guest_requests for all to authenticated using (true) with check (true);
create policy "authenticated read guests" on request_guests for select to authenticated using (true);
create policy "authenticated write guests" on request_guests for all to authenticated using (true) with check (true);
create policy "authenticated read documents" on generated_documents for select to authenticated using (true);
create policy "authenticated write documents" on generated_documents for all to authenticated using (true) with check (true);
create policy "authenticated read sends" on email_sends for select to authenticated using (true);
create policy "authenticated write sends" on email_sends for all to authenticated using (true) with check (true);
create policy "authenticated read audit" on audit_logs for select to authenticated using (true);
create policy "authenticated write audit" on audit_logs for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('pdf-templates', 'pdf-templates', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('generated-documents', 'generated-documents', false)
on conflict (id) do nothing;

create policy "authenticated read pdf templates" on storage.objects
for select to authenticated
using (bucket_id = 'pdf-templates');

create policy "authenticated write pdf templates" on storage.objects
for insert to authenticated
with check (bucket_id = 'pdf-templates');

create policy "authenticated update pdf templates" on storage.objects
for update to authenticated
using (bucket_id = 'pdf-templates')
with check (bucket_id = 'pdf-templates');

create policy "authenticated read generated documents" on storage.objects
for select to authenticated
using (bucket_id = 'generated-documents');

create policy "authenticated write generated documents" on storage.objects
for insert to authenticated
with check (bucket_id = 'generated-documents');

create policy "authenticated update generated documents" on storage.objects
for update to authenticated
using (bucket_id = 'generated-documents')
with check (bucket_id = 'generated-documents');
