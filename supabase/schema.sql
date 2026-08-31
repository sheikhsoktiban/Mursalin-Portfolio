-- Run in Supabase SQL editor.
-- Auth → Users → add one admin. Disable public sign-ups.

create extension if not exists "pgcrypto";

create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  first_name text not null default '',
  last_name text not null default '',
  role text not null default '',
  badge text not null default '',
  bio text not null default '',
  about text not null default '',
  location text not null default '',
  email text not null default '',
  phone text not null default '',
  github text not null default '',
  linkedin text not null default '',
  photo_meta text not null default '',
  portrait_url text not null default '/portrait.jpg',
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('fullstack', 'backend', 'ai', 'realtime')),
  description text not null default '',
  highlights jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  github text not null default '',
  stars int not null default 0,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  message text not null,
  emoji text not null default '🚀',
  tag text not null default 'Guest',
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  category text not null default '',
  subject text not null default '',
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profile enable row level security;
alter table public.projects enable row level security;
alter table public.guestbook enable row level security;
alter table public.messages enable row level security;

drop policy if exists "profile_public_read" on public.profile;
create policy "profile_public_read" on public.profile for select using (true);
drop policy if exists "profile_auth_write" on public.profile;
create policy "profile_auth_write" on public.profile for all to authenticated using (true) with check (true);

drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read" on public.projects for select using (true);
drop policy if exists "projects_auth_write" on public.projects;
create policy "projects_auth_write" on public.projects for all to authenticated using (true) with check (true);

drop policy if exists "guestbook_public_read" on public.guestbook;
create policy "guestbook_public_read" on public.guestbook for select using (true);
drop policy if exists "guestbook_public_insert" on public.guestbook;
create policy "guestbook_public_insert" on public.guestbook for insert with check (true);
drop policy if exists "guestbook_auth_delete" on public.guestbook;
create policy "guestbook_auth_delete" on public.guestbook for delete to authenticated using (true);

drop policy if exists "messages_public_insert" on public.messages;
create policy "messages_public_insert" on public.messages for insert with check (true);
drop policy if exists "messages_auth_read" on public.messages;
create policy "messages_auth_read" on public.messages for select to authenticated using (true);
drop policy if exists "messages_auth_write" on public.messages;
create policy "messages_auth_write" on public.messages for all to authenticated using (true) with check (true);

create or replace function public.increment_project_stars(pid uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare n int;
begin
  update public.projects set stars = stars + 1 where id = pid returning stars into n;
  return coalesce(n, 0);
end;
$$;

revoke all on function public.increment_project_stars(uuid) from public;
grant execute on function public.increment_project_stars(uuid) to anon, authenticated;

insert into public.profile (
  id, first_name, last_name, role, badge, bio, about, location, email, phone, github, linkedin, photo_meta, portrait_url
) values (
  '00000000-0000-0000-0000-000000000001',
  'Mohammad', 'Mursalin', 'Backend Software Engineer',
  'Available for Backend Roles & Collaborations',
  'I build secure, scalable REST systems with Java and Spring Boot — JWT, OAuth2, real-time WebSockets, and LangChain-powered AI. Clean architecture. Production-ready backends.',
  'I’m a backend-focused software engineer. I treat APIs like products: secure by default, layered with intent, and ready for real traffic. Java and Spring Boot are home; Python and FastAPI show up when the problem is language.',
  'Bangladesh / Remote', 'mursalinlamon@gmail.com', '+8801814958978',
  'https://github.com/mohammad-mursalin',
  'https://www.linkedin.com/in/mohammad-mursalin-67326a287',
  'Bangladesh · Available for roles', '/portrait.jpg'
) on conflict (id) do nothing;

insert into public.projects (id, title, category, description, highlights, tags, github, sort_order) values
('11111111-1111-4111-8111-111111111111', 'Full-Stack E-Commerce Platform', 'fullstack',
 'Architected a full-stack B2C e-commerce platform with a React storefront and a Spring Boot REST API, following a clean layered architecture.',
 '["Layered Spring Boot API with JWT-secured customer sessions","Stripe checkout in the purchase flow","Real-time updates over WebSockets","PostgreSQL persistence and a React client that respects the API boundary"]'::jsonb,
 '["React","Spring Boot","PostgreSQL","Stripe","JWT","WebSockets"]'::jsonb,
 'https://github.com/mohammad-mursalin/ecom_with_payment', 1),
('22222222-2222-4222-8222-222222222222', 'AI Research Paper Translator', 'ai',
 'Intelligent system that translates academic PDFs while preserving structure, equations, and technical meaning using LangChain-orchestrated LLM pipelines.',
 '["Structure-aware PDF ingestion","LangChain orchestration for multi-step translation","Preserves equations and domain terminology","FastAPI service with a React client"]'::jsonb,
 '["FastAPI","LangChain","Python","LLM APIs","PDF","React"]'::jsonb,
 'https://github.com/mohammad-mursalin/research-paper-translator', 2),
('33333333-3333-4333-8333-333333333333', 'Real-Time Chat Application', 'realtime',
 'Scalable chat system supporting private and group messaging with WebSocket delivery and JWT authentication.',
 '["Private threads and group rooms","WebSocket delivery for live messages","JWT-authenticated sessions","MongoDB as the message store"]'::jsonb,
 '["Spring Boot","WebSockets","MongoDB","JavaScript","JWT"]'::jsonb,
 'https://github.com/mohammad-mursalin/chat-app', 3),
('44444444-4444-4444-8444-444444444444', 'Hospital Queue & Appointments', 'backend',
 'High-traffic backend for online appointments and real-time queue management with role-based dashboards.',
 '["Role-based dashboards and access control","Live queue updates over WebSockets","JWT-secured REST APIs","PostgreSQL and MongoDB together"]'::jsonb,
 '["Spring Boot","REST","JWT","PostgreSQL","MongoDB","WebSockets"]'::jsonb,
 'https://github.com/mohammad-mursalin/live-queue-monitoring-system', 4),
('55555555-5555-4555-8555-555555555555', 'Smart Complaint Management', 'backend',
 'Secure role-based platform allowing users to submit complaints and admins to manage responses.',
 '["Role-based access for users and admins","JWT-secured Spring Boot services","PostgreSQL as the system of record","Server-rendered JSP operational UI"]'::jsonb,
 '["Spring Boot","JWT","PostgreSQL","JSP"]'::jsonb,
 'https://github.com/mohammad-mursalin/smart-complaint-management-system', 5),
('66666666-6666-4666-8666-666666666666', 'Mess Management System', 'backend',
 'Operational system for mess billing, members, and day-to-day tracking.',
 '["Python service for member and meal operations","Practical ops tooling rather than a demo CRUD app"]'::jsonb,
 '["Python"]'::jsonb,
 'https://github.com/mohammad-mursalin/mess-management-system', 6)
on conflict (id) do nothing;
