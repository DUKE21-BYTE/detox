-- Run this in your Supabase SQL Editor

-- 1. Create a table for user profiles (extends default auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  primary_goal text,
  risk_times text[],
  daily_goal_minutes integer,
  
  constraint username_length check (char_length(full_name) >= 2)
);

-- 2. Create a table for focus sessions
create table public.focus_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  duration_minutes integer not null,
  completed boolean default true
);

-- 3. Set up Row Level Security (RLS) so users can only see their own data
alter table public.profiles enable row level security;
alter table public.focus_sessions enable row level security;

create policy "Users can view their own profile."
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can view their own sessions."
  on public.focus_sessions for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own sessions."
  on public.focus_sessions for insert
  with check ( auth.uid() = user_id );

-- 4. Create a helper to auto-create profile on signup (optional but helpful)
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, daily_goal_minutes)
  values (new.id, new.raw_user_meta_data->>'full_name', 60);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
