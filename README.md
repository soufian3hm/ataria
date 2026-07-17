# عطارية فدك — Link Hub

Linktree-style bio-link site for **عطارية فدك (Fadk1) — كركوك**, built with Next.js 15 (App Router), TypeScript, and Tailwind CSS v4. Arabic RTL, dark emerald & gold theme.

## Pages

| Route    | What it is                                                                 |
| -------- | -------------------------------------------------------------------------- |
| `/`      | Public link-in-bio page (WhatsApp numbers, TikTok ×3, Facebook, Instagram, Maps) |
| `/admin` | Admin dashboard — manage links, profile, socials, view click stats, live preview |
| `/login` | Admin login                                                                 |

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the admin panel is at http://localhost:3000/admin.

**Default admin password:** `fadak123` — change it in [.env.local](.env.local) (`ADMIN_PASSWORD`), and set a random `AUTH_SECRET`.

## Features

- **Admin dashboard**: add / edit / delete / reorder / enable-disable links, featured (gold) links, profile & social-icon editor, live phone-frame preview.
- **WhatsApp multi-number card**: a link with numbers expands into a tappable list (each number opens `wa.me`, with copy button). Local Iraqi numbers (`07…`) are auto-converted to `+964`.
- **Analytics**: page views + per-link click counts, shown in the dashboard with ranked bars.
- **Share button** on the public page (native share / copy link).

## Data — Supabase (single table)

All content (profile, socials, links, stats, settings) lives in **one JSONB row** in a single `linkhub` table. Run [supabase/schema.sql](supabase/schema.sql) once in your Supabase project's **SQL Editor** — it creates the table, enables RLS (no policies → only the server's secret key can touch it), and inserts the seed row.

When `SUPABASE_URL` / `SUPABASE_SECRET_KEY` are missing or unreachable, the app automatically falls back to file storage ([data/store.json](data/store.json)) so local dev always works.

## Deploy to Vercel

1. Run `supabase/schema.sql` in the Supabase SQL Editor (project `qqwdcljsgavmybfjsdrn`).
2. Push this folder to a Git repo and import it in Vercel (or `npx vercel`).
3. Add these Environment Variables in Vercel → Project → Settings:
   - `ADMIN_PASSWORD` — your admin password (pick a strong one!)
   - `AUTH_SECRET` — any long random string
   - `SUPABASE_URL` — `https://qqwdcljsgavmybfjsdrn.supabase.co`
   - `SUPABASE_SECRET_KEY` — the `sb_secret_...` key
4. Deploy. Admin edits and click stats now persist in Supabase.

## Display settings

In the dashboard (الروابط tab) you can switch how TikTok accounts render on the public page: **separate cards** or **one dropdown card** listing all accounts.
