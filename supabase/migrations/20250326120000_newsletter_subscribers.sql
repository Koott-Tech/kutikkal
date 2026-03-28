-- Run once in Supabase: SQL Editor → New query → Run.
-- Table for newsletter emails from the blog footer modal.

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  consent_at timestamptz not null default now(),
  source text not null default 'blog_newsletter',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_key unique (email)
);

create index if not exists idx_newsletter_subscribers_email
  on public.newsletter_subscribers (email);

alter table public.newsletter_subscribers enable row level security;

-- Inserts use the service role from the Next.js API route only (key stays on the server).

comment on table public.newsletter_subscribers is 'Newsletter emails from the site (e.g. blog modal).';
