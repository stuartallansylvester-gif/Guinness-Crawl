Guinness Bar Crawl App - Simple Version

What this is:
- A ready-to-upload Vercel project.
- Supabase URL and publishable key are already filled in.
- Live multiplayer scoring works after you run the SQL once in Supabase.

What you still need to do:
1. In Supabase, open SQL Editor.
2. Create a new query.
3. Paste the SQL from the app's "Copy SQL" button, or use the SQL shown below.
4. Click Run.
5. Upload this whole project to Vercel and deploy.

SQL to run in Supabase:

create table if not exists public.bar_crawl_settings (
  id int primary key,
  pubs jsonb not null,
  judges jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.bar_crawl_scores (
  pub text not null,
  judge text not null,
  scores jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (pub, judge)
);

alter publication supabase_realtime add table public.bar_crawl_settings;
alter publication supabase_realtime add table public.bar_crawl_scores;

Vercel upload:
- Go to https://vercel.com/new
- Create an account or sign in.
- Choose to upload/import a project.
- Upload the entire folder or the zip file.
- Click Deploy.
