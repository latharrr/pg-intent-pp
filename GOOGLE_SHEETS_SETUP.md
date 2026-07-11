# Google Sheets + Vercel Setup

This project runs on **Vercel + Google Sheets only** — no backend database.

- **PG inventory** lives in one Google Sheet.
- **Leads** (phone, budget, room type, etc.) are appended to another Google Sheet.
- Next.js server components/functions read/write the sheets via a service account.

---

## 1. Create a Google Cloud service account

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or use an existing one).
3. Enable the **Google Sheets API**:
   - APIs & Services → Enable APIs and Services → search "Google Sheets API" → Enable.
4. Create a service account:
   - IAM & Admin → Service Accounts → Create.
   - Name: `picapool-sheets`
   - Role: `Editor` (or `Viewer` if you only need reads — but leads need Editor).
5. Create a key for the service account:
   - Keys → Add Key → JSON.
   - Download the `.json` file. Keep it secret.

---

## 2. Env vars to set

Copy `.env.example` to `.env.local` and fill in:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_PG_SHEET_ID=1...
GOOGLE_LEAD_SHEET_ID=1...
NEXT_PUBLIC_PICAPOOL_WHATSAPP_NUMBER=919999999999
```

### Notes

- `GOOGLE_PRIVATE_KEY` must include the full PEM block. In Vercel, paste the key as one line with `\n` characters, or wrap it in quotes.
- The WhatsApp number is used as a fallback when store links aren't configured.

---

## 3. Create the PG inventory sheet

Create a Google Sheet and add this header row to the first sheet:

| id | name | areaId | pricePerMonth | roomTypes | foodPolicy | verifiedStatus | distanceToCollegeMin | amenities | genderPolicy | rating | active |
|---|---|---|---|---|---|---|---|---|---|---|---|

### Column rules

| Column | Values |
|---|---|
| `id` | Unique slug, e.g. `green-view-pg` |
| `areaId` | Must match an area in `lib/data/areas.ts` |
| `pricePerMonth` | Number, e.g. `14000` |
| `roomTypes` | Comma-separated: `solo`, `shared_2`, `shared_3` |
| `foodPolicy` | `non_veg_ok`, `veg_only`, `no_food`, or empty |
| `verifiedStatus` | `TRUE` or `FALSE` |
| `distanceToCollegeMin` | Number, e.g. `6` |
| `amenities` | Comma-separated: `wifi`, `laundry`, `geyser`, `attached_bathroom`, etc. |
| `genderPolicy` | `male_only`, `female_only`, `any` |
| `rating` | Number 0–5 or empty |
| `active` | `TRUE` to show on the site, anything else hides it |

### Example row

```
green-view-pg | Green View PG | hudson-lane | 16000 | shared_2 | non_veg_ok | TRUE | 6 | wifi,laundry | any | 4.4 | TRUE
```

---

## 4. Create the leads sheet

Create a second Google Sheet and add this header row:

| timestamp | name | phone | email | whatsappOptIn | budgetBand | roomType | moveTimeline | bestAreaName | leadScore | referralSource |
|---|---|---|---|---|---|---|---|---|---|---|

The app will append one row per saved plan.

`referralSource` is the code from a personalized link (e.g. `pg.picapool.tech/insta_ritika` → `insta_ritika`, or the WhatsApp template's `{{1}}` button param). If you already have this sheet from before, just add the `referralSource` column header - existing rows are unaffected.

---

## 5. Share the sheets

For each sheet:

1. Click **Share**.
2. Add the service account email (`GOOGLE_SERVICE_ACCOUNT_EMAIL`).
3. PG sheet permission: **Viewer**.
4. Leads sheet permission: **Editor**.

---

## 6. Test locally

```bash
npm run dev
```

Visit `/results` after completing the 3-question flow. The server console will log the data source:

```
source: sheets   # fetched from Google Sheets
source: static   # using static mock data (env vars not set)
```

---

## 7. Deploy to Vercel

1. Push code to GitHub.
2. Import repo in Vercel.
3. Add all env vars from `.env.example` in Project Settings → Environment Variables.
4. Deploy.

---

## 8. Referral links + stats (`/admin`)

`/admin` (password-gated, see `ADMIN_PASSWORD` in `.env.example`) generates personalized links like
`pg.picapool.tech/insta_ritika` for influencers/campaigns and reports on them. It uses two more tabs
in the **same spreadsheet as the PG inventory** (`GOOGLE_PG_SHEET_ID`) - both are auto-created the
first time you open `/admin` or generate a link, so you don't need to create them by hand:

- **Referrals** - one row per generated link: `slug | label | link | createdAt`.
- **ReferralStats** - recomputed (cleared and rewritten) every time you open `/admin` or click
  "Refresh now": `referralSource | opens | completed | completionRate | avgTimeToCompleteSec | dropOffCount | topDropOffStep | downloadClicks | lastUpdated`.

Stats are computed from the **Analytics** tab, so add one more column to it if you already created
it before this feature existed:

```
timestampIso
```

(append it as the last header cell - it's a raw ISO timestamp used for precise duration math,
alongside the existing human-readable `date`/`time` columns.)

---

## Areas and colleges

Areas and colleges are still static in `lib/data/areas.ts` and `lib/data/colleges.ts`. If your PGs are in new areas, update those files too.

---

## Security notes

- Never commit `.env.local` or the service account JSON.
- The PG sheet only needs Viewer access.
- The leads sheet should be restricted to your team.
