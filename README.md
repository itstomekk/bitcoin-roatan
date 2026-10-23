# Bitcoin Roatán

**Live site:** [bitcoinroatan.info](https://bitcoinroatan.info)

Bitcoin Roatán is a neutral, practical guide to using Bitcoin on
[Roatán](https://en.wikipedia.org/wiki/Roat%C3%A1n), an island off the north coast of Honduras.
It is maintained by local organizations and volunteers, and it aims to be accurate and useful
rather than promotional.

The site covers:

- **Use**: a live map of shops, restaurants, hotels and services that accept Bitcoin, plus ATMs,
  places to get Bitcoin, and a getting-started checklist for wallets.
- **Why**: why Bitcoin matters on the island.
- **What's Up**: upcoming events and community links.
- **About**: the project and its partners.
- The site is in English and Spanish.

## Where the data comes from

- **Merchant map**: [BTCMap](https://btcmap.org/map), a community map of Bitcoin-accepting places
  built on [OpenStreetMap](https://www.openstreetmap.org). The site keeps a copy of every Roatán
  place and pulls BTCMap changes automatically. To add or fix a place,
  [edit it on BTCMap](https://btcmap.org/add-location) and the site picks the change up.
- **Events**: the events listing on [Prospera.Place](https://prospera.place).
- **ATMs, guides and texts**: `src/data/` and `src/contexts/LanguageContext.tsx` (EN + ES).

## Related links

- Community WhatsApp group: <https://chat.whatsapp.com/FQ9Uu5WR6VOGgh5sPaSuFK>
- The Bitcoin District events: <https://thebitcoindistrict.com/events>
- Bitcoin Center Roatán (AmityAge Academy): <https://www.amityage.com/bitcoin-center-roatan>
- Blink wallet: <https://blink.sv>
- Próspera: <https://prospera.co>

## How it works

```
Browser ──> Cloudflare Pages ──> static site (Vite + React, built to dist/)
                       └──> Pages Functions /api/*  ──> Cloudflare D1 (SQLite)
                                       └── /api/sync-btcmap ──> BTCMap API
```

- **Frontend**: Vite, React, TypeScript, Tailwind, shadcn/ui, Leaflet for the map.
- **Backend**: three small [Pages Functions](https://developers.cloudflare.com/pages/functions/)
  in `functions/api/`, with shared code in `server/lib.ts`.
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/). The schema is in
  `db/schema.sql`, with tables `places`, `email_subscribers` and `meta`. `meta.btcmap_cursor`
  stores the sync position.
- **Hosting**: Cloudflare Pages, project `bitcoin-roatan`. Test URL: <https://bitcoin-roatan.pages.dev>

| Method | Path | What it does |
|---|---|---|
| GET | `/api/places` | List all places on the map (cached 5 min) |
| POST | `/api/subscribe` | Body `{email}`: join the mailing list. 201 new, 200 `already:true`, 422 invalid |
| POST | `/api/sync-btcmap` | Pull BTCMap changes since the last sync. Runs at most once per 30 minutes and is triggered when the map loads |

The site was first built with [Lovable](https://lovable.dev). On 2026-10-23 it moved to this repo and
Cloudflare, so that the code is open and the site no longer depends on the builder.

## Run it locally

You need Node.js 20+.

```bash
npm install
npm run dev                                            # frontend only, http://localhost:8080
npx --yes wrangler@4 d1 execute bitcoin-roatan --local --file db/schema.sql   # create local tables once
npm run build && npx --yes wrangler@4 pages dev dist   # frontend + API + local database
npx tsc -p functions/tsconfig.json                     # typecheck the API
```

## Deploy (maintainers)

Every push or merge to `main` deploys automatically through GitHub Actions
(`.github/workflows/deploy.yml`). The Cloudflare credentials are stored as repository secrets.

To deploy by hand, put `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in your environment
(never commit them) and run:

```bash
npm run build
npx --yes wrangler@4 pages deploy dist --project-name bitcoin-roatan --branch main
npx --yes wrangler@4 d1 execute bitcoin-roatan --remote --file db/schema.sql -y   # schema changes only
```

Subscriber emails are stored only in D1. They are never committed to this repo. Maintainers can
export the list with:

```bash
npx --yes wrangler@4 d1 execute bitcoin-roatan --remote --json --command "select email, created_at from email_subscribers order by created_at"
```

## Known external dependency

`src/components/BitcoinEventsBox.tsx` reads events from Prospera.Place's current backend (Supabase)
with its public read-only key. That key is designed to be public. It will point to the new events
API once Prospera.Place moves too.

## Contributing

Issues and pull requests are welcome. Corrections to guide text, ATMs or links are the most
useful. To change a merchant listing, edit it on [BTCMap](https://btcmap.org) instead.

## License

[MIT](LICENSE)
