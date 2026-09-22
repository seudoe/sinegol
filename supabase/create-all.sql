-- Sinegol — core schema
-- Tables only: no triggers, functions, or RLS policies here.
-- Enum-like fields are plain text + check constraints, matching the
-- unions in types/*.ts (see docs/assumptions.md for the score/draw mapping).

create extension if not exists "pgcrypto";

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  name text not null,
  email text not null unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  plan text not null check (plan in ('monthly', 'yearly')),
  status text not null default 'inactive'
    check (status in ('active', 'inactive', 'cancelled', 'past_due')),
  amount numeric(10, 2) not null,
  renewal_date date not null,
  stripe_subscription_id text unique
);

create table golf_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  score integer not null check (score between 1 and 45),
  played_date date not null,
  created_at timestamptz not null default now(),
  unique (user_id, played_date)
);

create table charities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  image_url text,
  featured boolean not null default false
);

create table user_charities (
  user_id uuid primary key references profiles (id) on delete cascade,
  charity_id uuid not null references charities (id) on delete restrict,
  contribution_percentage numeric(5, 2) not null
    check (contribution_percentage > 0 and contribution_percentage <= 100)
);

create table draws (
  id uuid primary key default gen_random_uuid(),
  month text not null unique,
  method text not null check (method in ('random', 'algorithmic')),
  numbers integer[] not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create table winners (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null references draws (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  match_tier smallint not null check (match_tier in (3, 4, 5)),
  prize_amount numeric(10, 2) not null,
  proof_url text,
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'approved', 'rejected')),
  payout_status text not null default 'pending'
    check (payout_status in ('pending', 'paid'))
);
