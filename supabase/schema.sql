create extension if not exists pgcrypto;

create type account_type as enum ('admin','moderator','member');
create type admin_role_type as enum ('super_admin','admin','moderator');
create type ticket_status as enum ('new','in_review','answered','closed');
create type post_status as enum ('draft','scheduled','published','archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text,
  display_name text not null default 'مشارك Warm',
  gender text check (gender in ('male','female','unspecified')),
  avatar_key text not null default 'warm-default',
  account_type account_type not null default 'member',
  is_verified boolean not null default false,
  is_blocked boolean not null default false,
  accepted_terms_at timestamptz,
  theme_preference text not null default 'dark' check (theme_preference in ('dark','light','red')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role admin_role_type not null,
  title text,
  granted_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_permissions (
  id uuid primary key default gen_random_uuid(),
  role admin_role_type not null,
  permission text not null,
  unique(role,permission)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null unique,
  slug text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id),
  category_id uuid references public.categories(id),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  cover_image text,
  status post_status not null default 'draft',
  is_breaking boolean not null default false,
  is_featured boolean not null default false,
  published_at timestamptz,
  scheduled_at timestamptz,
  view_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_media (id uuid primary key default gen_random_uuid(), post_id uuid not null references public.posts(id) on delete cascade, media_type text not null, url text not null, caption text, sort_order integer default 0, created_at timestamptz not null default now());
create table public.post_likes (post_id uuid references public.posts(id) on delete cascade, user_id uuid references public.profiles(id) on delete cascade, created_at timestamptz not null default now(), primary key(post_id,user_id));
create table public.post_comments (id uuid primary key default gen_random_uuid(), post_id uuid not null references public.posts(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade, parent_id uuid references public.post_comments(id) on delete cascade, body text not null check(length(body)>0), is_hidden boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.comment_likes (comment_id uuid references public.post_comments(id) on delete cascade, user_id uuid references public.profiles(id) on delete cascade, created_at timestamptz not null default now(), primary key(comment_id,user_id));
create table public.saved_posts (post_id uuid references public.posts(id) on delete cascade, user_id uuid references public.profiles(id) on delete cascade, created_at timestamptz not null default now(), primary key(post_id,user_id));
create table public.post_views (id uuid primary key default gen_random_uuid(), post_id uuid not null references public.posts(id) on delete cascade, user_id uuid references public.profiles(id), viewer_ip text, created_at timestamptz not null default now());

create table public.chat_rooms (
  id uuid primary key default gen_random_uuid(), title text not null, description text,
  post_id uuid references public.posts(id) on delete set null, creator_id uuid not null references public.profiles(id),
  is_open boolean not null default true, participant_limit integer, starts_at timestamptz not null default now(),
  ends_at timestamptz, message_count bigint not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.chat_room_members (room_id uuid references public.chat_rooms(id) on delete cascade, user_id uuid references public.profiles(id) on delete cascade, joined_at timestamptz not null default now(), left_at timestamptz, primary key(room_id,user_id));
create table public.chat_messages (id uuid primary key default gen_random_uuid(), room_id uuid not null references public.chat_rooms(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade, parent_id uuid references public.chat_messages(id) on delete set null, body text not null check(length(body)>0), is_deleted boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.message_reactions (message_id uuid references public.chat_messages(id) on delete cascade, user_id uuid references public.profiles(id) on delete cascade, reaction text not null check(length(reaction)<=24), created_at timestamptz not null default now(), primary key(message_id,user_id,reaction));
create table public.message_reports (id uuid primary key default gen_random_uuid(), message_id uuid not null references public.chat_messages(id) on delete cascade, reporter_id uuid not null references public.profiles(id) on delete cascade, reason text not null, status text not null default 'open', created_at timestamptz not null default now());
create table public.user_identity_sessions (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, room_id uuid references public.chat_rooms(id) on delete cascade, revealed_at timestamptz not null default now(), expires_at timestamptz not null check(expires_at>revealed_at), reward_event_id uuid, created_at timestamptz not null default now());

create table public.advertisements (id uuid primary key default gen_random_uuid(), title text not null, image_url text, video_url text, destination_url text, placement text not null, page_type text not null default 'all', ad_size text not null default 'small', duration_seconds integer not null default 15, start_at timestamptz not null default now(), end_at timestamptz, is_active boolean not null default true, max_impressions integer, created_by uuid references public.profiles(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.ad_impressions (id uuid primary key default gen_random_uuid(), ad_id uuid not null references public.advertisements(id) on delete cascade, user_id uuid references public.profiles(id), created_at timestamptz not null default now());
create table public.ad_clicks (id uuid primary key default gen_random_uuid(), ad_id uuid not null references public.advertisements(id) on delete cascade, user_id uuid references public.profiles(id), created_at timestamptz not null default now());
create table public.ad_reward_events (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, provider text not null, provider_event_id text not null unique, ad_id uuid references public.advertisements(id), verified boolean not null default false, verified_at timestamptz, expires_at timestamptz, created_at timestamptz not null default now());

create table public.support_tickets (id uuid primary key default gen_random_uuid(), ticket_number text not null unique, user_id uuid references public.profiles(id), category text not null, subject text not null, body text not null, status ticket_status not null default 'new', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.support_replies (id uuid primary key default gen_random_uuid(), ticket_id uuid not null references public.support_tickets(id) on delete cascade, sender_id uuid not null references public.profiles(id), body text not null, is_admin_reply boolean not null default false, created_at timestamptz not null default now());
create table public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, type text not null, title text not null, body text, link text, is_read boolean not null default false, created_at timestamptz not null default now());
create table public.user_reports (id uuid primary key default gen_random_uuid(), reporter_id uuid not null references public.profiles(id) on delete cascade, reported_user_id uuid references public.profiles(id), post_id uuid references public.posts(id), room_id uuid references public.chat_rooms(id), reason text not null, status text not null default 'open', created_at timestamptz not null default now());
create table public.site_settings (key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());
create table public.audit_logs (id uuid primary key default gen_random_uuid(), actor_id uuid references public.profiles(id), action text not null, entity_type text, entity_id text, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());

create index on public.posts(status,published_at desc);
create index on public.posts(category_id,published_at desc);
create index on public.post_comments(post_id,created_at);
create index on public.chat_messages(room_id,created_at);
create index on public.notifications(user_id,is_read,created_at desc);
create index on public.support_tickets(status,created_at desc);
create index on public.advertisements(placement,is_active,start_at,end_at);

insert into public.categories(name_ar,slug,sort_order) values
('أخبار محلية','local',1),('أخبار عالمية','world',2),('رياضة','sports',3),('تكنولوجيا','technology',4),
('اقتصاد','economy',5),('منوعات','variety',6),('إعلام وفن','media-art',7),('مقالات وتحليلات','analysis',8),('أخبار عاجلة','breaking',9)
on conflict do nothing;

insert into public.admin_permissions(role,permission) values
('super_admin','*'),('admin','manage_news'),('admin','manage_rooms'),('admin','manage_ads'),('admin','manage_support'),('admin','manage_users'),('moderator','manage_comments'),('moderator','manage_rooms'),('moderator','review_reports')
on conflict do nothing;

create or replace function public.is_admin()
returns boolean language sql security definer set search_path=public as $$
  select exists(select 1 from public.admin_roles where user_id=auth.uid() and role in ('super_admin','admin'));
$$;
create or replace function public.is_moderator()
returns boolean language sql security definer set search_path=public as $$
  select exists(select 1 from public.admin_roles where user_id=auth.uid());
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,phone,display_name,gender,accepted_terms_at)
  values (new.id, coalesce(new.phone,''), coalesce(new.raw_user_meta_data->>'display_name','مشارك Warm'),
    coalesce(new.raw_user_meta_data->>'gender','unspecified'), now())
  on conflict(id) do update set phone=excluded.phone;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.admin_roles enable row level security;
alter table public.admin_permissions enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.post_media enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.comment_likes enable row level security;
alter table public.saved_posts enable row level security;
alter table public.post_views enable row level security;
alter table public.chat_rooms enable row level security;
alter table public.chat_room_members enable row level security;
alter table public.chat_messages enable row level security;
alter table public.message_reactions enable row level security;
alter table public.message_reports enable row level security;
alter table public.user_identity_sessions enable row level security;
alter table public.advertisements enable row level security;
alter table public.ad_impressions enable row level security;
alter table public.ad_clicks enable row level security;
alter table public.ad_reward_events enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_replies enable row level security;
alter table public.notifications enable row level security;
alter table public.user_reports enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_read on public.profiles for select using (true);
create policy profiles_update_self on public.profiles for update using (id=auth.uid()) with check (id=auth.uid());
create policy categories_read on public.categories for select using (is_active);
create policy categories_admin on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy posts_read on public.posts for select using (status='published' or author_id=auth.uid() or public.is_admin());
create policy posts_admin on public.posts for all using (public.is_admin()) with check (public.is_admin());
create policy post_media_read on public.post_media for select using (exists(select 1 from public.posts p where p.id=post_id and (p.status='published' or p.author_id=auth.uid() or public.is_admin())));
create policy post_media_admin on public.post_media for all using (public.is_admin()) with check (public.is_admin());
create policy likes_read on public.post_likes for select using (true);
create policy likes_own on public.post_likes for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy comments_read on public.post_comments for select using (not is_hidden or user_id=auth.uid() or public.is_moderator());
create policy comments_create on public.post_comments for insert with check (auth.uid()=user_id);
create policy comments_update on public.post_comments for update using (user_id=auth.uid() or public.is_moderator()) with check (user_id=auth.uid() or public.is_moderator());
create policy comments_delete on public.post_comments for delete using (user_id=auth.uid() or public.is_moderator());
create policy comment_likes on public.comment_likes for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy saved_own on public.saved_posts for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy views_insert on public.post_views for insert with check (user_id is null or user_id=auth.uid());
create policy rooms_read on public.chat_rooms for select using (true);
create policy rooms_admin on public.chat_rooms for all using (public.is_admin()) with check (public.is_admin());
create policy room_members_read on public.chat_room_members for select using (true);
create policy room_members_join on public.chat_room_members for insert with check (user_id=auth.uid());
create policy room_members_leave on public.chat_room_members for update using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy messages_read on public.chat_messages for select using (not is_deleted or public.is_moderator());
create policy messages_create on public.chat_messages for insert with check (auth.uid()=user_id and exists(select 1 from public.chat_rooms r where r.id=room_id and r.is_open));
create policy messages_modify on public.chat_messages for update using (user_id=auth.uid() or public.is_moderator()) with check (user_id=auth.uid() or public.is_moderator());
create policy reactions on public.message_reactions for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy reports_create on public.message_reports for insert with check (reporter_id=auth.uid());
create policy reports_admin on public.message_reports for all using (public.is_moderator()) with check (public.is_moderator());
create policy identity_own on public.user_identity_sessions for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy ads_read on public.advertisements for select using (is_active and start_at<=now() and (end_at is null or end_at>=now()));
create policy ads_admin on public.advertisements for all using (public.is_admin()) with check (public.is_admin());
create policy ad_impressions_insert on public.ad_impressions for insert with check (user_id is null or user_id=auth.uid());
create policy ad_clicks_insert on public.ad_clicks for insert with check (user_id is null or user_id=auth.uid());
create policy rewards_own on public.ad_reward_events for select using (user_id=auth.uid());
create policy tickets_own on public.support_tickets for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy tickets_admin on public.support_tickets for all using (public.is_moderator()) with check (public.is_moderator());
create policy replies_own on public.support_replies for select using (exists(select 1 from public.support_tickets t where t.id=ticket_id and t.user_id=auth.uid()) or public.is_moderator());
create policy replies_insert on public.support_replies for insert with check (sender_id=auth.uid());
create policy notifications_own on public.notifications for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy user_reports_create on public.user_reports for insert with check (reporter_id=auth.uid());
create policy user_reports_admin on public.user_reports for all using (public.is_moderator()) with check (public.is_moderator());
create policy settings_read on public.site_settings for select using (true);
create policy settings_admin on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy audit_admin on public.audit_logs for select using (public.is_moderator());

insert into storage.buckets(id,name,public) values ('news-media','news-media',true),('ad-media','ad-media',true),('brand-assets','brand-assets',true)
on conflict(id) do nothing;

insert into storage.buckets(id,name,public) values
('branding','branding',true),('site-banners','site-banners',true),('news-images','news-images',true),
('advertisements','advertisements',true),('admin-assets','admin-assets',true)
on conflict(id) do nothing;

insert into public.site_settings(key,value) values
('brand','{"name":"Warm Media","tagline":"أخبار بعيون مختلفة","description":"منصة إعلامية واجتماعية عربية","footer":"© 2026 Warm Media"}'::jsonb),
('theme','{"default":"dark","red_enabled":true}'::jsonb),
('typography','{"font":"Alexandria","sizes":{"h1":44,"h2":26,"h3":18,"body":15},"colors":{"main":"#FFFFFF","secondary":"#A7AAB5","link":"#ED1728","buttonText":"#FFFFFF"}}'::jsonb)
on conflict(key) do nothing;

create policy "branding_upload_admin" on storage.objects for insert to authenticated
with check (bucket_id in ('branding','site-banners','news-images','advertisements','admin-assets','brand-assets','ad-media','news-media') and public.is_admin());
create policy "branding_update_admin" on storage.objects for update to authenticated
using (bucket_id in ('branding','site-banners','news-images','advertisements','admin-assets','brand-assets','ad-media','news-media') and public.is_admin())
with check (bucket_id in ('branding','site-banners','news-images','advertisements','admin-assets','brand-assets','ad-media','news-media') and public.is_admin());
create policy "branding_delete_admin" on storage.objects for delete to authenticated
using (bucket_id in ('branding','site-banners','news-images','advertisements','admin-assets','brand-assets','ad-media','news-media') and public.is_admin());
create policy "public_brand_read" on storage.objects for select to public
using (bucket_id in ('branding','site-banners','news-images','advertisements','admin-assets','brand-assets','ad-media','news-media'));

alter publication supabase_realtime add table public.chat_messages, public.chat_room_members, public.notifications;

create or replace function public.protect_profile_fields()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.account_type is distinct from old.account_type
     or new.is_verified is distinct from old.is_verified
     or new.is_blocked is distinct from old.is_blocked then
    if not public.is_admin() then
      raise exception 'Protected profile fields cannot be changed by a regular user';
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists protect_profile_fields on public.profiles;
create trigger protect_profile_fields before update on public.profiles
for each row execute function public.protect_profile_fields();

create or replace function public.protect_super_admin_roles()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if tg_op in ('UPDATE','DELETE') and old.role='super_admin' then
    if not exists(select 1 from public.admin_roles r where r.user_id=auth.uid() and r.role='super_admin' and r.user_id<>old.user_id)
       and not (auth.jwt()->>'role'='service_role') then
      raise exception 'The super admin role is protected';
    end if;
  end if;
  if tg_op='INSERT' and not public.is_admin() and not (auth.jwt()->>'role'='service_role') then
    raise exception 'Only administrators can grant administrative roles';
  end if;
  return coalesce(new,old);
end;
$$;
drop trigger if exists protect_super_admin_roles on public.admin_roles;
create trigger protect_super_admin_roles before insert or update or delete on public.admin_roles
for each row execute function public.protect_super_admin_roles();
