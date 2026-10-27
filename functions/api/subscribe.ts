import { json, type Env } from '../../server/lib';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sends one plain notification per NEW signup through Resend. Never blocks or fails the signup.
async function notify(env: Env, email: string, total: number): Promise<void> {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO) return;
  const to = env.NOTIFY_TO.split(',').map((s) => s.trim()).filter(Boolean);
  const when = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  const text = `New signup on bitcoinroatan.info\n\nEmail: ${email}\nTime: ${when}\nSubscribers now: ${total}\n`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.NOTIFY_FROM || 'Bitcoin Roatán <notify@bitcoinroatan.info>',
      to,
      subject: `New signup: ${email}`,
      text,
    }),
  });
  if (!res.ok) console.error('notify failed', res.status, (await res.text()).slice(0, 300));
}

// POST /api/subscribe {email} -> adds to the mailing list. 201 new, 200 already subscribed.
export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
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
  if (created) {
    waitUntil(
      env.DB.prepare('SELECT COUNT(*) AS n FROM email_subscribers')
        .first<{ n: number }>()
        .then((row) => notify(env, email, row?.n ?? 0))
        .catch((e) => console.error('notify error', String(e))),
    );
  }
  return json({ ok: true, already: !created }, created ? 201 : 200);
};
