import { json, type Env } from '../../server/lib';

// GET /api/places -> public list of Bitcoin-accepting places on Roatán
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    `SELECT id, name, category, lat, lng, address, phone, website, opening_hours,
            payment_lightning, payment_onchain
       FROM places ORDER BY name`,
  ).all();
  const places = results.map((p: Record<string, unknown>) => ({
    ...p,
    payment_lightning: !!p.payment_lightning,
    payment_onchain: !!p.payment_onchain,
  }));
  return json({ ok: true, places }, 200, { 'cache-control': 'public, max-age=300' });
};
