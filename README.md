# Torotech.ca

Marketing site, content workspace and lead pipeline for **Torotech** — AI solutions for SAP (S/4HANA, BTP, Fiori) and AI-integrated web development.

| Layer | Choice |
| --- | --- |
| Frontend | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 |
| Auth | Clerk (admin surface only — the public site has no auth dependency) |
| Backend | Next.js route handlers on Node.js 22 |
| Database | DuckDB (embedded HTAP): content, leads, page events and no-code field definitions in one file |
| Content | Built-in `/admin` workspace: Markdown editor, drafts/publish, uploads, custom fields, lead inbox, live analytics, SQL workbench |
| Deploy | Docker multi-stage image + `docker compose` with Caddy for automatic HTTPS |

## Quick start (local)

```bash
cp .env.example .env.local      # then edit
npm install
npm run dev                     # http://localhost:3000
```

For a first look without a Clerk account, set in `.env.local`:

```
AUTH_DISABLED=true
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
```

This opens `/admin` without sign-in. It is ignored as soon as a Clerk key is configured, so it can never expose a real deployment.

The database file is created and seeded automatically on first request at `DATA_DIR/torotech.duckdb` (default `./data`).

## Configure Clerk (production)

1. Create an application at [dashboard.clerk.com](https://dashboard.clerk.com); enable Email + Google (or whatever you prefer).
2. Copy the keys into `.env`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_…`
   - `CLERK_SECRET_KEY=sk_live_…`
3. Set `ADMIN_EMAILS=you@torotech.ca` — only these accounts can open `/admin`. Leave empty during setup to allow any signed-in user.
4. In Clerk → Paths, set sign-in URL to `/sign-in` and after-sign-in to `/admin`.

## Deploy to a Linux server with Docker

```bash
# on the server
git clone https://github.com/ravisoni18/torotech-website.git /opt/torotech
cd /opt/torotech
cp .env.example .env && nano .env      # Clerk keys, ADMIN_EMAILS, ANALYTICS_SALT, SITE_DOMAIN
docker compose up -d --build
```

- Point `torotech.ca` and `www.torotech.ca` A/AAAA records at the server. Caddy obtains Let's Encrypt certificates automatically and redirects `www` → apex.
- Data lives in the `torotech-data` volume (`/data` in the container): the DuckDB file and uploaded media.
- Upgrade: `git pull && docker compose up -d --build`.
- Backups: `deploy/backup.sh` tars the volume; add it to cron.
- Logs: `docker compose logs -f web`.

### Email (optional)

`mail/` holds a self-hosted mail stack — [docker-mailserver] for SMTP/IMAP plus
Roundcube webmail at `mail.torotech.ca`, sharing the app's Caddy. It gives you real
`@torotech.ca` mailboxes and an SMTP endpoint the app uses for lead notifications and
enquirer acknowledgements (`SMTP_*` in `.env`). Setup — DNS, reverse DNS, mailbox
creation, DKIM — is in [`mail/setup.md`](mail/setup.md).

[docker-mailserver]: https://docker-mailserver.github.io/docker-mailserver/latest/

Local Docker preview without TLS or Clerk: `npm run docker:local` → http://localhost:3000.

## Content model

Everything editable lives in the `content` table with a `type`:

| Type | Public URL | Purpose |
| --- | --- | --- |
| `service` | `/services/<slug>` | Service pages (home page shows the first four by sort order) |
| `case_study` | `/work/<slug>` | Case studies with a headline metric |
| `post` | `/blog/<slug>` | Insights / blog |
| `product` | `/products/<slug>` | Product showcase — a media gallery of images, GIFs and short clips |
| `page` | `/<slug>` | Reserved for extra static pages |

Bodies are Markdown (GFM: tables, task lists, code fences). Each item has a `data` JSON column for **custom fields**, defined under **Admin → Fields** with no code or migration. Custom fields also apply to the contact form (`lead` entity) and are queryable in SQL as `data->>'key'`.

**Products** have a dedicated **Admin → Products** grid and a gallery panel in the editor: upload PNG/JPG/WebP images, animated GIFs, or MP4/WebM clips (≤ 50 MB) — stored as `data.gallery`, first item is the card preview. Clips render as muted, looping, autoplaying `<video>`; the media route serves range requests so they seek.

## Analytics

`src/components/marketing/Analytics.tsx` posts a page view on every route change to `/api/track`. The server stores the path, referrer host, device class and a **daily-salted hash** of IP + user agent — never the raw IP — so it is cookie-free and needs no consent banner in most jurisdictions. Admin traffic and bots are excluded from the dashboards.

**Admin → Query** is a read-only SQL workbench over the same DuckDB file (SELECT/WITH only, 500-row cap).

## Environment variables

See `.env.example`. Notables:

| Variable | Purpose |
| --- | --- |
| `DATA_DIR` | Directory for the DuckDB file and uploads (`/data` in Docker) |
| `ANALYTICS_SALT` | Random string mixed into the visitor hash |
| `ADMIN_EMAILS` | Comma-separated allowlist for `/admin` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | SMTP for lead notifications + enquirer acknowledgement. Empty `SMTP_HOST` disables email |
| `SMTP_FROM` / `LEAD_NOTIFY_TO` | From header and where new-lead emails are delivered |
| `LEAD_WEBHOOK_URL` | Optional — every new lead is POSTed here as JSON (Slack, Zapier, n8n, CRM) |
| `AUTH_DISABLED` | Local preview only; ignored when a Clerk key is set |

## Project layout

```
src/
  app/(marketing)/   public pages
  app/(admin)/       /admin workspace + /sign-in (Clerk)
  app/api/           track, leads, health, media, admin/* (auth-gated)
  components/        marketing/ and admin/ UI
  lib/               db.ts (DuckDB), content, leads, analytics, fields, auth
  fonts/             self-hosted Manrope + JetBrains Mono (no external requests)
deploy/              Caddyfile, backup script
```

## Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run lint` · `npm run typecheck` · `npm run docker:build` · `npm run docker:local`
