import { json, type Env } from '../../server/lib';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/subscribe {email} -> adds to the mailing list. 201 new, 200 already subscribed.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'invalid_email' }, 422);
  }
  const r = await env.DB.prepare(
    `INSERT INTO email_subscribers (id, email, source) VALUES (?, ?, 'bitcoinroatan.info')
     ON CONFLICT(email) DO NOTHING`,
  )
    .bind(crypto.randomUUID(), email)
    .run();
  const created = (r.meta.changes ?? 0) > 0;
  return json({ ok: true, already: !created }, created ? 201 : 200);
};
