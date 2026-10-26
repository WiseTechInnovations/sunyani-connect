# Sunyani Connect — next steps after configuring the publishable key

The public Supabase URL and publishable key have been inserted into `config.js`.
This alone DOES NOT create the database, turn on sign-ups, or grant an administrator role.

1. Open your Supabase project > SQL Editor > New query, paste all of `schema.sql` and run it. Review the tables and RLS policies under Database. Do not run it in GitHub.
2. Supabase > Authentication > Providers > Email: enable email/password. Decide whether to require email confirmation (recommended).
3. Supabase > Authentication > URL Configuration: set Site URL to `https://wisetechinnovations.github.io/sunyani-connect/` and include `https://wisetechinnovations.github.io/sunyani-connect/**` in allowed redirect URLs if appropriate to your auth flows.
4. Upload the updated website files, including `config.js`, to the GitHub repository root (same level as `index.html`). Do not upload any Supabase secret keys.
5. Visit your published `account.html`, register your own administrator account and confirm your email.
6. Only AFTER registering, run this command in Supabase SQL Editor (replace the placeholder with your actual admin login email):

   insert into public.admin_users(user_id)
   select id from auth.users where email = 'YOUR_ADMIN_LOGIN_EMAIL'
   on conflict do nothing;

7. Sign in and test `list.html`, then review and approve the test listing in `admin.html`. Verify it appears to signed-out visitors after approval.
8. Verify your Supabase project URL under Settings > Data API. If it differs from `config.js`, correct it before deployment.

Security: publishable keys may be public only when RLS is configured correctly. Never place `sb_secret_...` or service-role keys in browser files, screenshots, or your GitHub repository. Do not share your database password.
