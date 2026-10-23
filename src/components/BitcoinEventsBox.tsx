import { useEffect, useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface PlaceEvent {
  id: string;
  name: string;
  short_description: string | null;
  location: string | null;
  event_date: string | null;
  event_time: string | null;
  event_host: string | null;
  website: string | null;
  cta_link: string | null;
  is_recurring: boolean;
  recurring_pattern: string | null;
  tags: string[] | null;
}

const SUPABASE_URL = 'https://cwhrvvqpkmqcdkpyqktv.supabase.co';
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3aHJ2dnFwa21xY2RrcHlxa3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTIyMjQsImV4cCI6MjA4MzM4ODIyNH0.RdaKCttN8Iep-dMUAbr3VlZJP_h7ZUzFKjoz98e_-dc';

function formatWhen(e: PlaceEvent): string {
  if (e.event_date) {
    const iso = e.event_date + (e.event_time && /^\d{2}:\d{2}/.test(e.event_time) ? `T${e.event_time}` : 'T00:00:00');
    const d = new Date(iso);
    if (!isNaN(d.getTime())) {
      const base = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (e.event_time && !/^\d{2}:\d{2}/.test(e.event_time)) return `${base} · ${e.event_time}`;
      if (e.event_time) {
        const t = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        return `${base} · ${t}`;
      }
      return base;
    }
  }
  if (e.is_recurring) return e.recurring_pattern || e.event_time || 'Recurring';
  return 'TBA';
}

const VIBE_CAMP_PROMO: PlaceEvent = {
  id: 'promo-bitcoin-vibe-camp',
  name: 'Bitcoin Vibe Camp',
  short_description: 'Vibecoding workshops, free for Roatán residents',
  location: 'Roatán',
  event_date: null,
  event_time: null,
  event_host: 'Bitcoin Vibe Camp',
  website: 'https://bitcoinvibe.camp',
  cta_link: 'https://bitcoinvibe.camp',
  is_recurring: true,
  recurring_pattern: 'Ongoing',
  tags: ['bitcoin'],
};

// Show the promo roughly every third hour, stable within the hour.
function shouldShowPromo(): boolean {
  return Math.floor(Date.now() / 3600000) % 3 === 0;
}

function normalizeKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').slice(0, 3).join(' ');
}

export function BitcoinEventsBox() {
  const [event, setEvent] = useState<PlaceEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const filter =
      'or=(name.ilike.*bitcoin*,short_description.ilike.*bitcoin*,long_description.ilike.*bitcoin*,tags.cs.{bitcoin},event_host.ilike.*bitcoin*)';
    const url = `${SUPABASE_URL}/rest/v1/listings?category=eq.events&status=eq.approved&${filter}&or=(event_date.gte.${today},event_date.is.null)&order=event_date.asc.nullslast&limit=20`;

    fetch(url, { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } })
      .then((r) => r.json())
      .then((data: PlaceEvent[]) => {
        if (!Array.isArray(data)) return setEvent(null);
        // Dedupe by normalized name key, prefer dated over recurring
        const seen = new Map<string, PlaceEvent>();
        for (const e of data) {
          const key = normalizeKey(e.name);
          const existing = seen.get(key);
          if (!existing) seen.set(key, e);
          else if (!existing.event_date && e.event_date) seen.set(key, e);
        }
        const list = Array.from(seen.values());
        const dated = list
          .filter((e) => e.event_date)
          .sort((a, b) => (a.event_date! < b.event_date! ? -1 : 1));
        const recurring = list.filter((e) => !e.event_date && e.is_recurring);

        // Soonest is the nearest dated event; if none, first recurring.
        // If a recurring event exists, coin-flip between soonest dated and a random recurring.
        let next: PlaceEvent | null = dated[0] || recurring[0] || list[0] || null;
        if (dated[0] && recurring.length > 0 && Math.random() < 0.5) {
          next = recurring[Math.floor(Math.random() * recurring.length)];
        }
        setEvent(shouldShowPromo() ? VIBE_CAMP_PROMO : next);
      })
      .catch(() => setEvent(shouldShowPromo() ? VIBE_CAMP_PROMO : null))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !event) return null;

  const link = event.cta_link || event.website || 'https://prospera.place';
  const when = formatWhen(event);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full max-w-2xl mx-auto mb-8 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 sm:p-6 hover:bg-white/[0.08] hover:border-[hsl(25,95%,55%,0.4)] transition-all"
    >
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-[hsl(25,95%,60%)]" />
        <h2 className="text-white/70 font-semibold tracking-wide text-xs uppercase">
          {event.id === VIBE_CAMP_PROMO.id ? 'Featured' : 'Next Bitcoin Event'}
        </h2>
      </div>
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-white text-base sm:text-lg font-semibold leading-tight">
          {event.name}
        </span>
        <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-[hsl(25,95%,55%,0.15)] text-[hsl(25,95%,70%)] border border-[hsl(25,95%,55%,0.3)]">
          {when}
        </span>
      </div>
      {event.short_description && (
        <p className="text-white/75 text-sm leading-snug mb-2">
          {event.short_description}
        </p>
      )}
      {event.location && (
        <p className="text-white/55 text-xs inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {event.location}
        </p>
      )}
    </a>
  );
}
