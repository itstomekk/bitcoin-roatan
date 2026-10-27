// Nostr DM notifications from Pages Functions (NIP-04, kind 4), signed by a dedicated bot key.
import { finalizeEvent, getPublicKey, nip04 } from 'nostr-tools';
import type { Env } from './lib';

const DEFAULT_RELAYS = ['wss://relay.primal.net', 'wss://nos.lol', 'wss://relay.damus.io', 'wss://relay.ditto.pub'];

const hexToBytes = (h: string) => Uint8Array.from(h.match(/../g)!.map((b) => parseInt(b, 16)));

// Publish one event to one relay over an outbound WebSocket; resolves with the relay's OK verdict.
async function publish(relay: string, event: object, timeoutMs = 6000): Promise<string> {
  const resp = await fetch(relay.replace(/^wss:/, 'https:'), { headers: { Upgrade: 'websocket' } });
  const ws = resp.webSocket;
  if (!ws) return `${relay}: no websocket (${resp.status})`;
  ws.accept();
  return new Promise((resolve) => {
    const done = (msg: string) => {
      clearTimeout(t);
      try { ws.close(); } catch { /* already closed */ }
      resolve(`${relay}: ${msg}`);
    };
    const t = setTimeout(() => done('timeout'), timeoutMs);
    ws.addEventListener('message', (ev) => {
      try {
        const m = JSON.parse(String(ev.data));
        if (m[0] === 'OK') done(m[2] ? 'ok' : `rejected ${m[3] ?? ''}`);
      } catch { /* ignore non-JSON */ }
    });
    ws.addEventListener('error', () => done('error'));
    ws.send(JSON.stringify(['EVENT', event]));
  });
}

export async function nostrDM(env: Env, text: string): Promise<string[]> {
  if (!env.NOSTR_NOTIFY_SK_HEX || !env.NOSTR_NOTIFY_TO_HEX) {
    console.log('nostr dm skipped: missing', !env.NOSTR_NOTIFY_SK_HEX ? 'NOSTR_NOTIFY_SK_HEX' : 'NOSTR_NOTIFY_TO_HEX');
    return [];
  }
  const sk = hexToBytes(env.NOSTR_NOTIFY_SK_HEX);
  const to = env.NOSTR_NOTIFY_TO_HEX;
  const content = await nip04.encrypt(sk, to, text);
  const event = finalizeEvent({ kind: 4, created_at: Math.floor(Date.now() / 1000), tags: [['p', to]], content }, sk);
  const relays = (env.NOSTR_RELAYS || DEFAULT_RELAYS.join(',')).split(',').map((s) => s.trim()).filter(Boolean);
  const results = await Promise.all(relays.map((r) => publish(r, event).catch((e) => `${r}: ${String(e)}`)));
  console.log('nostr dm', event.id, getPublicKey(sk), results.join(' | '));
  return results;
}
