create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null check (role in ('CUSTOMER', 'STUDENT')),
  subscription_status text not null check (subscription_status in ('TRIAL', 'ACTIVE', 'EXPIRED')),
  trial_ends_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  location text not null,
  price numeric(10, 2) not null,
  task_date date not null,
  status text not null default 'OPEN' check (status in ('OPEN', 'ASSIGNED', 'COMPLETED', 'CANCELLED')),
  customer_id uuid not null references users(id) on delete cascade,
  assigned_student_id uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  student_id uuid not null references users(id) on delete cascade,
  message text,
  status text not null default 'PENDING' check (status in ('PENDING', 'ACCEPTED', 'REJECTED')),
  created_at timestamptz not null default now(),
  unique(task_id, student_id)
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_set_updated_at on tasks;
create trigger tasks_set_updated_at
before update on tasks
for each row
execute function set_updated_at();
