-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (synced with Clerk or created on first login)
create table users (
  id uuid default uuid_generate_v4() primary key,
  clerk_id text unique not null,
  email text,
  full_name text,
  business_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Receipts table
create table receipts (
  id uuid default uuid_generate_v4() primary key,
  user_id text references users(clerk_id) not null,
  receipt_number text not null,
  client_name text not null,
  client_email text,
  items jsonb not null default '[]'::jsonb, -- Array of { description, quantity, rate, amount }
  subtotal decimal(10, 2) not null default 0,
  tax decimal(10, 2) not null default 0,
  total decimal(10, 2) not null default 0,
  payment_method text,
  notes text,
  status text check (status in ('draft', 'sent', 'paid')) default 'draft',
  issued_date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table users enable row level security;
alter table receipts enable row level security;

-- Policies for Users
-- We use (select auth.jwt() ->> 'sub') to get the Clerk User ID from the JWT
create policy "Users can view their own profile" on users
  for select using ((select auth.jwt() ->> 'sub') = clerk_id);

create policy "Users can update their own profile" on users
  for update using ((select auth.jwt() ->> 'sub') = clerk_id);

create policy "Users can insert their own profile" on users
  for insert with check ((select auth.jwt() ->> 'sub') = clerk_id);

-- Policies for Receipts
create policy "Users can view their own receipts" on receipts
  for select using ((select auth.jwt() ->> 'sub') = user_id);

create policy "Users can insert their own receipts" on receipts
  for insert with check ((select auth.jwt() ->> 'sub') = user_id);

create policy "Users can update their own receipts" on receipts
  for update using ((select auth.jwt() ->> 'sub') = user_id);

create policy "Users can delete their own receipts" on receipts
  for delete using ((select auth.jwt() ->> 'sub') = user_id);

-- Weekly Income View
create or replace view weekly_income_view as
select
  user_id,
  date_trunc('week', issued_date) as week_start,
  sum(total) as total_income,
  count(*) as receipt_count
from receipts
where status = 'paid'
group by user_id, date_trunc('week', issued_date);
