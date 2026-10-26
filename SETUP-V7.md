# Sunyani Connect V7 — database setup and deployment

## What works now
The existing GitHub Pages website and static researched listings remain available. New **Account**, **List a business**, and **Admin review** pages are included. These require configuring Supabase; until then they intentionally say online accounts are unavailable. No misleading local-only “online submitted” confirmation.

## Enable online listings
1. Create a Supabase project you control at https://supabase.com.
2. Open SQL Editor, paste and run `schema.sql`. It creates the `businesses` and `admin_users` tables with row-level security.
3. Under Authentication > Providers enable email/password. Decide whether you require email confirmation (recommended). Set Site URL to your GitHub Pages URL and add the same URL to redirects.
4. Under Project Settings / API, copy **Project URL** and **publishable/anon key**. Edit `config.js` and paste the two values. **Never paste the secret/service_role key.**
5. Upload ALL updated HTML, CSS, JS and SQL/docs files to GitHub root; `index.html` must remain in root.
6. Open `account.html`, sign up with your own administrator email and confirm it.
7. In Supabase SQL Editor run:
   `insert into public.admin_users(user_id) select id from auth.users where email='YOUR_ADMIN_EMAIL@example.com' on conflict do nothing;`
   Replace the email; confirm the query inserted one row. This makes *that signed-in user* an admin. Do not expose this command in the website UI.
8. Use `list.html` to sign in and submit a test listing. Use `admin.html` to approve; it should then appear on `discover.html`, `categories.html`, and `map.html` when online.

## Security & limitations
- The anon/publishable key can appear in browser code because Supabase Row-Level Security (RLS) enforces access; always enable RLS. No service_role secret or payment credentials in GitHub.
- Submission is moderated and initially **pending**. Public listings show only after approval. Verified badges are not automatic.
- Photo uploads, owner editing, real GPS pins, and full business profile pages require later work. `image_url` is reserved but not exposed as a user upload.
- Existing seed listings are sourced/unverified. Do not claim all listed addresses, schools, or businesses are verified.
- `map.html` currently uses Google Maps search for places, not geocoded permanent markers.
- Review site on actual mobile devices before announcing it publicly.
- For a future secure custom domain, configure it in GitHub Pages and Supabase Auth URL settings.
