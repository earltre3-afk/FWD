-- Optional FWD persistence schema
-- Run only when you are ready to connect FWD to Supabase.

create table if not exists public.gifs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  tags text[] not null default '{}',
  category text not null default 'Reactions',
  duration numeric not null default 0,
  is_public boolean not null default true,
  media_url text not null,
  thumbnail_url text,
  width int not null default 480,
  height int not null default 480,
  format text not null default 'gif',
  alt_text text,
  mood text
);

alter table public.gifs enable row level security;

drop policy if exists "Public read public gifs" on public.gifs;
create policy "Public read public gifs"
  on public.gifs for select
  using (is_public = true);

-- For a closed/public demo, keep inserts handled by your own trusted server route.
-- If you enable direct client uploads later, replace this with an authenticated policy.

create index if not exists gifs_public_created_idx on public.gifs (is_public, created_at desc);
create index if not exists gifs_category_idx on public.gifs (category);
