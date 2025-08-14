# Moonday — Step 1 (Deploy-first)

Use this repo with Vercel + Supabase (no local dev required).

## 0) Create Supabase tables
Open Supabase SQL editor and paste `supabase/tables.sql` (see file). Run it.

## 1) Get your Supabase keys
Supabase → Settings → API
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2) Set ENV on Vercel
Vercel Dashboard → Your Project → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` = (paste Project URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (paste anon key)

Apply to: Production + Preview. Save.

## 3) Deploy
Push to GitHub → Import on Vercel → Deploy.

Visit your Vercel URL.
