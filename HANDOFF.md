# HANDOFF: Bitcoin Roatán

## Status (2026-10-23)

- The site runs on Cloudflare at https://bitcoin-roatan.pages.dev and has been verified.
  It is not on the real domain yet.
- `bitcoinroatan.info` is still served by Lovable (project `d9357afc-4595-45cb-a8d0-a975f5235452`).
- D1 `bitcoin-roatan` (id `07ab8536-4ee5-4cbb-8b46-38f691665116`) contains:
  - 91 places: the 80 from Lovable, 34 of them updated and 11 added from BTCMap changes
    since 2026-02-23. Lovable's own sync had stopped on 2026-02-23.
  - 2 email subscribers, copied from Lovable.
- Code repo: GitHub `itstomekk/bitcoin-roatan` (private).

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

- The "Next Bitcoin Event" box still reads from the Prospera.Place Supabase. Switch it when
  that project migrates.
- Some events have an ISO timestamp in `event_time`, so the raw string shows in the box.
  This is a data issue and also appears on the Lovable site.
- `public/` and the logo were recovered from the live site. `src/assets/bitcoin-arena.png`
  was not recovered because it is not used in the build.
