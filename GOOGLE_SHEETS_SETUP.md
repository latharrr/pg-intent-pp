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

| timestamp | name | phone | email | whatsappOptIn | budgetBand | roomType | moveTimeline | bestAreaName | leadScore |
|---|---|---|---|---|---|---|---|---|---|

The app will append one row per saved plan.

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

## Areas and colleges

Areas and colleges are still static in `lib/data/areas.ts` and `lib/data/colleges.ts`. If your PGs are in new areas, update those files too.

---

## Security notes

- Never commit `.env.local` or the service account JSON.
- The PG sheet only needs Viewer access.
- The leads sheet should be restricted to your team.
