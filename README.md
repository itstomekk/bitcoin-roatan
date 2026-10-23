# Bitcoin Roatán (bitcoinroatan.info)

A practical guide to using Bitcoin on Roatán, with a live map of the island's
Bitcoin-accepting places taken from BTCMap. It was moved off Lovable on 2026-10-23.

- Frontend: Vite + React + Tailwind (shadcn/ui), built to `dist/`.
- Backend: Cloudflare Pages Functions (`functions/`) on a D1 database.
- Hosting: Cloudflare Pages project `bitcoin-roatan`. Test URL: https://bitcoin-roatan.pages.dev
- Production domain: `bitcoinroatan.info` (on Lovable until the DNS switch).

## API

| Method | Path | What it does |
|---|---|---|
| GET | `/api/places` | List all places (cached 5 min) |
| POST | `/api/subscribe` | Body `{email}`. Returns 201 for a new signup, 200 with `already:true` if the email exists, 422 if the email is invalid |
| POST | `/api/sync-btcmap` | Pulls BTCMap changes since the last sync (v3 `updated_since`). Runs at most once per 30 minutes and is triggered when the map loads |

The shared mapping code is in `server/lib.ts`. The schema is in `db/schema.sql`, with tables
`places`, `email_subscribers` and `meta`. `meta.btcmap_cursor` stores the sync cursor.

## Develop

```bash
npm install
npm run dev                      # frontend only (no /api)
npm run build && npx --yes wrangler@4 pages dev dist   # frontend + functions + local D1
npx tsc -p functions/tsconfig.json                     # typecheck functions
```

## Deploy

You need `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the environment. Never commit them.

```bash
npm run build
npx --yes wrangler@4 pages deploy dist --project-name bitcoin-roatan --branch main
npx --yes wrangler@4 d1 execute bitcoin-roatan --remote --file db/schema.sql -y   # schema changes only
```

## Export the mailing list

```bash
npx --yes wrangler@4 d1 execute bitcoin-roatan --remote --json --command "select email, created_at from email_subscribers order by created_at"
```

## External dependency

`src/components/BitcoinEventsBox.tsx` reads events from the Prospera.Place Lovable/Supabase
project. It uses that project's public anon key, which is already exposed in the live site.
Point it at the new events API once Prospera.Place moves off Lovable.
