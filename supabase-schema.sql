create table if not exists public.site_settings (
  id bigint primary key,
  hero_name_top text,
  hero_name_bottom text,
  bg_color text,
  font_family text,
  profile_image_url text
);

alter table public.site_settings enable row level security;

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings
for select to anon using (true);

drop policy if exists "anon upsert settings" on public.site_settings;
create policy "anon upsert settings" on public.site_settings
for all to anon using (true) with check (true);
