-- Enable RLS (Row Level Security)
alter table if exists public.content enable row level security;

-- Create content table if it doesn't exist
create table if not exists public.content (
  id text primary key,
  user_id uuid references auth.users(id) default auth.uid(),
  content_type text not null,
  content_data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create or replace function to automatically update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
drop trigger if exists content_updated_at on public.content;
create trigger content_updated_at
  before update on public.content
  for each row
  execute function public.handle_updated_at();

-- RLS Policies
-- Allow users to read their own content or public content
create policy "Users can read own content" on public.content
  for select
  using (auth.uid() = user_id or user_id is null);

-- Allow users to insert their own content
create policy "Users can insert own content" on public.content
  for insert
  with check (auth.uid() = user_id or user_id is null);

-- Allow users to update their own content
create policy "Users can update own content" on public.content
  for update
  using (auth.uid() = user_id or user_id is null);

-- Allow users to delete their own content
create policy "Users can delete own content" on public.content
  for delete
  using (auth.uid() = user_id or user_id is null);

-- Create index for better performance
create index if not exists content_user_id_idx on public.content(user_id);
create index if not exists content_type_idx on public.content(content_type);
create index if not exists content_updated_at_idx on public.content(updated_at desc);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.content to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;