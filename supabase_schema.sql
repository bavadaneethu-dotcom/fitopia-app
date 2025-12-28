-- Enable Row Level Security (RLS)
alter table auth.users enable row level security;

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  stats jsonb,
  character jsonb,
  inventory jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- 2. Activity Logs (Workouts & Meditations)
create table public.activity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text check (type in ('workout', 'meditation')),
  title text not null,
  icon text,
  duration text,
  calories integer,
  color text,
  date date not null,
  timestamp text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.activity_logs enable row level security;
create policy "Users can view own activities" on activity_logs for select using (auth.uid() = user_id);
create policy "Users can insert own activities" on activity_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own activities" on activity_logs for update using (auth.uid() = user_id);
create policy "Users can delete own activities" on activity_logs for delete using (auth.uid() = user_id);

-- 3. Food Logs
create table public.food_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  calories integer not null,
  macros jsonb,
  micros jsonb,
  icon text,
  display_amount text,
  date date not null,
  timestamp text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.food_logs enable row level security;
create policy "Users can view own food" on food_logs for select using (auth.uid() = user_id);
create policy "Users can insert own food" on food_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own food" on food_logs for update using (auth.uid() = user_id);
create policy "Users can delete own food" on food_logs for delete using (auth.uid() = user_id);

-- 4. Water Logs
create table public.water_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  amount integer not null,
  date date not null,
  timestamp text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.water_logs enable row level security;
create policy "Users can view own water" on water_logs for select using (auth.uid() = user_id);
create policy "Users can insert own water" on water_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own water" on water_logs for update using (auth.uid() = user_id);
create policy "Users can delete own water" on water_logs for delete using (auth.uid() = user_id);

-- 5. Fasting Logs
create table public.fasting_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  duration text,
  start_time text,
  end_time text,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.fasting_logs enable row level security;
create policy "Users can view own fasting" on fasting_logs for select using (auth.uid() = user_id);
create policy "Users can insert own fasting" on fasting_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own fasting" on fasting_logs for update using (auth.uid() = user_id);
create policy "Users can delete own fasting" on fasting_logs for delete using (auth.uid() = user_id);

-- 6. Weight Logs
create table public.weight_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  value text not null,
  unit text check (unit in ('kg', 'lbs')),
  dimensions jsonb,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.weight_logs enable row level security;
create policy "Users can view own weight" on weight_logs for select using (auth.uid() = user_id);
create policy "Users can insert own weight" on weight_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own weight" on weight_logs for update using (auth.uid() = user_id);
create policy "Users can delete own weight" on weight_logs for delete using (auth.uid() = user_id);
