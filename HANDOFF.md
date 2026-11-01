# HANDOFF: Bitcoin Roatán

## Status (2026-10-23)

- The site runs on Cloudflare at https://bitcoin-roatan.pages.dev and has been verified.
  It is not on the real domain yet.
- `bitcoinroatan.info` is still served by Lovable (project `d9357afc-4595-45cb-a8d0-a975f5235452`).
- D1 `bitcoin-roatan` (id `07ab8536-4ee5-4cbb-8b46-38f691665116`) contains:
  - 91 places: the 80 from Lovable, 34 of them updated and 11 added from BTCMap changes
    since 2026-02-23. Lovable's own sync had stopped on 2026-02-23.
  - 2 email subscribers, copied from Lovable.
- Code repo: GitHub `itstomekk/bitcoin-roatan` (public).

## DNS (2026-10-26)

- Nameservers at the registry already point to Cloudflare (hunts/treasure.ns.cloudflare.com). The zone was stuck
  `initializing` without a plan, so the domain (site + mail) did not resolve. Fixed by adding the Free plan via API;
  the zone is `pending` and serving. 24 records (23 imported from smarthost.pl + GitHub Pages challenge TXT
  `_github-pages-challenge-itstomekk`). Record backup: `C:\Users\Lenovo\.secrets\backups\bitcoinroatan-dns-2026-10-26.json`.
- Apex and www: proxied CNAME -> `bitcoin-roatan.pages.dev` since 2026-10-26 (was Lovable A 185.158.133.1).
  Zone `active`, Pages custom domains `active`. Mail stays on cPanel (91.211.221.253).

## Cutover: DONE 2026-10-26

- Lovable had 2 subscribers (last 2026-04-23), the same 2 already in D1, so nothing new to copy.
- Live checks on bitcoinroatan.info: home 200 (same build as pages.dev, plus the Cloudflare Web Analytics beacon),
  www 200, `/api/places` 91, `/use` map 91 markers on desktop and mobile with no console errors, `og-image.png` 200,
  `/api/subscribe` 201/200/422 (test row deleted, count back to 2).
- Lovable project left as is (not deleted). Its publish is no longer reachable on the domain; unpublish it from the
  Lovable dashboard after 2 weeks if nothing breaks. Signups now land in D1 table `email_subscribers`.

## Signup notifications (2026-10-27)

- Each NEW signup sends a Nostr DM (NIP-04, kind 4) to Tomek's npub14wxts... from a dedicated bot key
  `npub1qs4gq29cmgmw8zwqym39x8nn72nd7mcxwq6awscjjq0tuc0splhse3tk6k` (`server/nostr.ts`), published to
  relay.primal.net, nos.lol, relay.damus.io, relay.ditto.pub. Test DM `3bb417253bfb…` read back on primal, nos.lol, ditto.
- Bot secret: Pages secret `NOSTR_NOTIFY_SK_HEX` (copy in `C:\Users\Lenovo\.secrets\bitcoinroatan-notify-nostr.env`).
  Recipient: `[vars] NOSTR_NOTIFY_TO_HEX` in wrangler.toml. With a wrangler.toml, Pages drops dashboard plain-text vars
  on every deploy; only secrets survive, so plain vars belong in the toml.
- Email via Resend is coded but idle until `RESEND_API_KEY` + `NOTIFY_TO` secrets exist (no Resend account yet).

## SEO and OG image (2026-10-30)

- New 1200x630 `public/og-image.png` (the old one was a 1920x1695 page screenshot). Tags carry `?v=2`.
- Per-route title, description, canonical and OG/Twitter tags are prerendered at build (`scripts/prerender.mjs`, data in `src/data/seoPages.json`). Sitemap is generated at build; unknown URLs now return a real 404. Details in DEVELOPMENT.md.
- robots.txt cleaned (old Lovable rules dropped), llms.txt refreshed, Organization JSON-LD has a logo.
- README related links: added Bitcoin District Próspera.

## Island map on the landing page (2026-10-31)

- `/` now ends with a full-width "Browse the island" section (`src/components/IslandMap.tsx`, lazy-loaded by `LazyIslandMap.tsx` when the visitor scrolls near it). Data is the D1 copy of BTCMap from `/api/places`; it also pings `/api/sync-btcmap`.
- Browsing: search and type chips (with counts) float over the top of the map, area jump buttons sit above it, "Surprise me", an "in view" list sorted by distance, clustered pins, popups with website/directions/BTC Map links, Dark / Street / Satellite base maps.
- Base maps are keyless: dark = OSM tiles with a CSS filter (CARTO dark tiles now return an "API KEY REQUIRED" tile), satellite = Esri World Imagery.
- Wheel zoom turns on after a click in the map; on touch screens dragging is off until "Tap to move the map", so the page still scrolls.
- `npm run dev` proxies `/api` to the live Pages site (read-only), so the map and events work locally.
- Removed the Satoshi Saturday event (`src/data/events.ts` and its `events.satoshi.*` strings); it is no longer held.
- `src/data/nowImportant.ts` trimmed to the Lightning line only (the Thursday meetup, ATM, merchants and Saturday workshop items were stale Lovable-era text).
- Subpages removed (2026-11-01, Tomek: only the landing page is used for now): `/hub`, `/why`, `/use`, `/whatsup`, `/about` now 301 to `/` via `public/_redirects`. Page files deleted (restore from git history, commit before 4435aeb's successor); their components (`MerchantMap`, `NavigationTile`, ...) are left in `src/components` unused. Only `/` is in `seoPages.json`, sitemap and `llms.txt`.
- Subpage design (2026-11-01, superseded: subpages removed): `PageContainer` now uses the same look as `/`: a still frame of the landing background video (`src/assets/roatan-bg.webp`) under the same dark brown/navy gradient, the logo on top, orange as the only accent, white-glass tiles and chips. `/use` map controls follow that too. The 404 page uses `PageContainer`. If the landing video changes, regenerate the still.
- `BitcoinEventsBox` hides any `.Place` listing named "Satoshi Saturday" (no longer held; the listing itself lives in the Prospera.Place Supabase).
- New dependency: `leaflet.markercluster` (+ `@types/leaflet.markercluster`).
- Tested in Firefox (desktop 1440 and mobile 390) against the live `/api/places`; build and eslint pass.

## Verified

- `/api/places` returns 91 places, and the map shows 91 markers on desktop and mobile.
- `/api/subscribe`: 201 for a new email, 200 `already` for a repeat, 422 for an invalid email.
  The test row was deleted afterwards.
- `/api/sync-btcmap` runs, and a second call within 30 minutes returns `cooldown`.
- Screenshots match the Lovable site. See `../lovable-migration/qa/bitcoin-roatan-info/`.

## Cutover (needs Tomek's go-ahead)

1. Copy any new signups from Lovable into D1 again, then switch DNS for `bitcoinroatan.info`.
   - Add the custom domain to Pages project `bitcoin-roatan`.
   - Remove the domain from the Lovable project.
2. Check the live domain: the map, a signup, and `og-image.png`.
3. Leave the Lovable project unpublished but not deleted for 2 weeks.

## Known

- `src/components/FeaturedEventBlock.tsx` holds one featured event (Bitcoin Whitepaper Day, 2026-10-31) shown on
  `/`, `/hub` and `/whatsup`. It hides itself after `endsAt`; swap the `EVENT` object for the next one.

- The "Next Bitcoin Event" box still reads from the Prospera.Place Supabase. Switch it when
  that project migrates.
- Some events have an ISO timestamp in `event_time`, so the raw string shows in the box.
  This is a data issue and also appears on the Lovable site.
- `public/` and the logo were recovered from the live site. `src/assets/bitcoin-arena.png`
  was not recovered because it is not used in the build.
