-- Phase 1: Database Schema Updates

-- 1. Add Tier & Stripe Fields to users
alter table users
  add column tier text not null default 'free' check (tier in ('free', 'pro')),
  add column stripe_customer_id text,
  add column stripe_subscription_status text;

-- 2. Extend receipts for PDFs + Soft Delete + Client Link
alter table receipts
  add column pdf_url text,
  add column deleted_at timestamptz,
  add column client_id uuid; -- Foreign key added after clients table creation

-- 3. Create clients Table
create table clients (
  id uuid default uuid_generate_v4() primary key,
  user_id text references users(clerk_id) not null,
  name text not null,
  email text,
  phone text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Add foreign key to receipts
alter table receipts
  add constraint fk_receipts_client
  foreign key (client_id)
  references clients(id);

-- Enable RLS on clients
alter table clients enable row level security;

-- RLS Policies for clients
create policy "Users can view their own clients" on clients
  for select using ((select auth.jwt() ->> 'sub') = user_id);

create policy "Users can insert their own clients" on clients
  for insert with check ((select auth.jwt() ->> 'sub') = user_id);

create policy "Users can update their own clients" on clients
  for update using ((select auth.jwt() ->> 'sub') = user_id);

create policy "Users can delete their own clients" on clients
  for delete using ((select auth.jwt() ->> 'sub') = user_id);

-- 4. Update Weekly Income View to exclude deleted receipts
create or replace view weekly_income_view as
select
  user_id,
  date_trunc('week', issued_date) as week_start,
  sum(total) as total_income,
  count(*) as receipt_count
from receipts
where status = 'paid'
  and deleted_at is null
group by user_id, date_trunc('week', issued_date);
