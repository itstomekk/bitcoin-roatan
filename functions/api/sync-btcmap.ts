import { coords, inRoatan, json, toPlace, type BtcmapElement, type Env } from '../../server/lib';

// POST /api/sync-btcmap -> pulls BTCMap changes since the last cursor and upserts Roatán places.
// Incremental (BTCMap v3 updated_since) because the full v2 dump is ~40 MB, too big for a Worker.
// Anyone may trigger it (the map does on load), so it runs at most once per COOLDOWN.
const COOLDOWN_MS = 30 * 60 * 1000;
const PAGE = 200;
const MAX_PAGES = 4;

export const onRequestPost: PagesFunction<Env> = async ({ env }) => {
  const meta = async (k: string) =>
    (await env.DB.prepare('SELECT value FROM meta WHERE key = ?').bind(k).first<{ value: string }>())?.value;
  const setMeta = (k: string, v: string) =>
    env.DB.prepare('INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').bind(k, v);

  const lastRun = Number((await meta('btcmap_last_run')) || 0);
  if (Date.now() - lastRun < COOLDOWN_MS) return json({ ok: true, skipped: 'cooldown' });
  await setMeta('btcmap_last_run', String(Date.now())).run();

  let cursor = (await meta('btcmap_cursor')) || '2026-02-23T00:00:00Z';
  let upserted = 0;
  let deleted = 0;
  let pages = 0;
  for (; pages < MAX_PAGES; pages++) {
    const res = await fetch(
      `https://api.btcmap.org/v3/elements?updated_since=${encodeURIComponent(cursor)}&limit=${PAGE}`,
      { headers: { 'user-agent': 'bitcoinroatan.info sync' } },
    );
    if (!res.ok) return json({ ok: false, error: `btcmap ${res.status}` }, 502);
    const els = (await res.json()) as BtcmapElement[];
    const stmts: D1PreparedStatement[] = [];
    for (const el of els) {
      const c = coords(el);
      if (!c || !inRoatan(c)) continue;
      const p = toPlace(el, c);
      if (el.deleted_at) {
        stmts.push(env.DB.prepare('DELETE FROM places WHERE id = ?').bind(p.id));
        deleted++;
        continue;
      }
      stmts.push(
        env.DB.prepare(
          `INSERT INTO places (id, name, category, lat, lng, address, phone, website, opening_hours,
             payment_lightning, payment_onchain, osm_type, osm_id, tags, last_synced_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
           ON CONFLICT(id) DO UPDATE SET name=excluded.name, category=excluded.category, lat=excluded.lat,
             lng=excluded.lng, address=excluded.address, phone=excluded.phone, website=excluded.website,
             opening_hours=excluded.opening_hours, payment_lightning=excluded.payment_lightning,
             payment_onchain=excluded.payment_onchain, osm_type=excluded.osm_type, osm_id=excluded.osm_id,
             tags=excluded.tags, last_synced_at=excluded.last_synced_at,
             updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')`,
        ).bind(p.id, p.name, p.category, p.lat, p.lng, p.address, p.phone, p.website, p.opening_hours,
          p.payment_lightning, p.payment_onchain, p.osm_type, p.osm_id, p.tags),
      );
      upserted++;
    }
    if (els.length) cursor = els.reduce((m, e) => (e.updated_at > m ? e.updated_at : m), cursor);
    stmts.push(setMeta('btcmap_cursor', cursor));
    await env.DB.batch(stmts);
    if (els.length < PAGE) break;
  }
  return json({ ok: true, upserted, deleted, pages: pages + 1, cursor });
};
