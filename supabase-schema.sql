-- ============================================================
-- Axon eSIM — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- CUSTOMERS
-- ============================================================
create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text not null,
  whatsapp text,
  created_at timestamptz default now()
);

create index if not exists customers_email_idx on customers(email);
create index if not exists customers_phone_idx on customers(phone);

-- ============================================================
-- PLANS
-- ============================================================
create table if not exists plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  data_gb numeric not null,
  validity_days integer not null,
  region text not null,
  countries text[] default '{}',
  price_pkr numeric not null,
  price_usd numeric not null,
  is_active boolean default true,
  is_featured boolean default false,
  badge text,
  description text,
  created_at timestamptz default now()
);

create index if not exists plans_region_idx on plans(region);
create index if not exists plans_active_idx on plans(is_active);

-- ============================================================
-- ORDERS
-- ============================================================
create type order_status as enum (
  'pending', 'paid', 'processing', 'delivered', 'activated', 'expired', 'cancelled'
);

create type payment_method as enum (
  'safepay', 'stripe', 'manual'
);

create table if not exists orders (
  id text primary key,  -- e.g. AXN-ABC123-XY99
  customer_id uuid not null references customers(id),
  plan_id uuid not null references plans(id),
  status order_status default 'pending',
  payment_method payment_method not null,
  amount_paid numeric not null,
  currency text not null default 'PKR',
  qr_code_url text,
  esim_code text,
  iccid text,
  activated_at timestamptz,
  expires_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

create index if not exists orders_customer_idx on orders(customer_id);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_idx on orders(created_at desc);

-- ============================================================
-- PAYMENTS
-- ============================================================
create type payment_status as enum (
  'pending', 'success', 'failed', 'refunded'
);

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  order_id text not null references orders(id) on delete cascade,
  gateway payment_method not null,
  transaction_id text,
  amount numeric not null,
  currency text not null default 'PKR',
  status payment_status default 'pending',
  gateway_response jsonb,
  created_at timestamptz default now()
);

create index if not exists payments_order_idx on payments(order_id);

-- ============================================================
-- ADMINS
-- ============================================================
create table if not exists admins (
  id uuid primary key references auth.users(id),
  email text not null unique,
  role text not null default 'admin' check (role in ('super_admin', 'admin', 'support')),
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Customers: only service role (server) can read/write
alter table customers enable row level security;
create policy "Service role only" on customers using (false);

-- Plans: anyone can read active plans; only admins can write
alter table plans enable row level security;
create policy "Public read active plans" on plans for select using (is_active = true);
create policy "Admins manage plans" on plans for all
  using (auth.role() = 'service_role');

-- Orders: customers can read their own (by email param); admins manage all
alter table orders enable row level security;
create policy "Service role full access orders" on orders
  using (auth.role() = 'service_role');

-- Payments: service role only
alter table payments enable row level security;
create policy "Service role only payments" on payments
  using (auth.role() = 'service_role');

-- Admins: only service role
alter table admins enable row level security;
create policy "Service role only admins" on admins
  using (auth.role() = 'service_role');

-- ============================================================
-- SEED DATA — Axon eSIM Plans (your actual prices)
-- Validity: 1GB = 7 days | All others = 30 days
-- USD = approximate (PKR ÷ 280, rounded nicely)
-- ============================================================
insert into plans (name, data_gb, validity_days, region, countries, price_pkr, price_usd, is_active, is_featured, badge, description) values
  -- 1 GB — 7 Days
  ('1 GB Global',   1,  7,  'Global',        ARRAY[]::text[], 430,  2,  true, false, null,           'Quick 7-day data plan — perfect for short trips'),
  -- 3 GB — 30 Days
  ('3 GB Global',   3,  30, 'Global',        ARRAY[]::text[], 1100, 4,  true, false, null,           'Reliable data for a full month of light usage'),
  -- 5 GB — 30 Days
  ('5 GB Global',   5,  30, 'Global',        ARRAY[]::text[], 1500, 6,  true, true,  'Most Popular', 'Best value for regular travelers — 30 days covered'),
  -- 10 GB — 30 Days
  ('10 GB Global',  10, 30, 'Global',        ARRAY[]::text[], 2450, 9,  true, true,  'Best Value',   'Heavy usage plan — stream, browse, stay connected'),
  -- 20 GB — 30 Days
  ('20 GB Global',  20, 30, 'Global',        ARRAY[]::text[], 3850, 14, true, false, 'Premium',      'Power user plan — unlimited browsing for a full month');
