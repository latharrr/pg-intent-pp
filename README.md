# Picapool PG Hunt Planner

A mobile-first lead-gen funnel for students moving to Delhi's North Campus for
college, who need to find a PG (paying-guest accommodation) before they land.
Users answer 3 quick questions, get matched PG/area recommendations, and hand
over their WhatsApp number to get their plan + a follow-up. No backend
database - **Next.js + Google Sheets, deployed on Vercel.**

Live at [pg.picapool.tech](https://pg.picapool.tech).

## Stack

- **Next.js 15** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Zustand** (persisted to `localStorage`) for the funnel/profile state
- **Tailwind CSS 4** + **shadcn/ui** primitives, **Framer Motion** for transitions
- **Google Sheets** as the entire backend (PG inventory, leads, analytics, referrals) via the `google-spreadsheet` + `google-auth-library` packages
- **Vitest** for unit tests

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values, see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without Google Sheets
credentials configured, PG data falls back to the static list in
`lib/data/pgs.ts` and leads/analytics fall back to in-memory storage (both
logged to the console) - so local dev works with zero setup, but nothing
persists.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
npm run test    # vitest
```

## The funnel

Steps live under `app/(journey)/`, one route each, all sharing a persistent
footer (`components/JourneyFooter.tsx`) via `app/(journey)/layout.tsx`:

1. **Hero** (`/`) - the pitch + "Plan My PG Hunt" CTA.
2. **Plan** (`/plan`) - a 3-question wizard (move timeline, budget, room
   type), driven by `features/onboarding/` + `lib/journey/`.
3. **Results** (`/results`) - PGs/areas matched against the profile
   (`lib/matching/`), phone capture inline if there's a match.
4. **Contact** (`/contact`) - phone capture when there's no PG match yet.
5. **Success** (`/success`) - confirmation + app download push.

State lives in `lib/store/useJourneyStore.ts` (Zustand, persisted), gated by
`lib/providers/StoreHydrationGate.tsx` so the UI never flashes step 0 before
`localStorage` loads.

### Personalized/referral links

`app/(journey)/[ref]/page.tsx` is a catch-all: any single path segment
(`pg.picapool.tech/insta_ritika`, or the value WhatsApp substitutes into a
template's `{{1}}` button param) renders the same hero flow instead of
404ing, and captures the segment as `referralSource` on the profile. Once
set, `lib/analytics.ts`'s `track()` auto-attaches it to every event, and it
rides along with the lead record to the Leads sheet - see `/admin` below for
where this data actually shows up.

## Admin dashboard (`/admin`)

Password-gated (`ADMIN_PASSWORD` env var, defaults to `6969` if unset -
**set a real one before this is ever public**). Auth is a signed cookie
checked by `middleware.ts`; see `lib/adminAuth.ts`.

- **Generate links** - type a slug, get `pg.picapool.tech/<slug>` back,
  saved to a `Referrals` tab (auto-created).
- **Referral stats** - recomputed on every visit (or "Refresh now") from the
  `Analytics` tab: opens, completions, completion rate, avg time to fill,
  drop-off count + step, download clicks - per referral source. Written to
  a `ReferralStats` tab (auto-created).

## Google Sheets backend

Every piece of persisted data - PG inventory, leads, analytics events,
referral links, referral stats - lives in Google Sheets tabs, read/written
via a single service account (`lib/googleSheets.ts`). Full setup
instructions (creating the service account, sheet IDs, expected header rows
per tab) are in **[GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)**.

## Environment variables

See `.env.example` for the full list with placeholders. Summary:

| Variable | Required for | Notes |
|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` | Sheets access | Service account credentials, shared with each sheet |
| `GOOGLE_PG_SHEET_ID` | PG inventory, analytics, referrals, referral stats | |
| `GOOGLE_LEAD_SHEET_ID` | Leads | Can be the same spreadsheet ID as `GOOGLE_PG_SHEET_ID` (different tab) or a separate one |
| `NEXT_PUBLIC_PICAPOOL_WHATSAPP_NUMBER` | WhatsApp handoff | Country code, no `+` |
| `NEXT_PUBLIC_APP_STORE_URL`, `NEXT_PUBLIC_PLAY_STORE_URL`, `NEXT_PUBLIC_APP_UNIVERSAL_LINK` | Post-signup app download push | |
| `ADMIN_PASSWORD` | `/admin` | Defaults to `6969` if unset - override in production |
| `NEXT_PUBLIC_SITE_URL` | Referral link generation | Defaults to `https://pg.picapool.tech`; only needed locally (`http://localhost:3000`) or if the domain changes |

## Deployment

Deployed on Vercel, auto-deploying from `master`. Set the env vars above in
Project Settings for each environment (Production/Preview/Development) you
use - Vercel doesn't share values across environments.
