import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// One-off featured event. Hides itself once `endsAt` has passed, so no cleanup deploy is needed.
const EVENT = {
  endsAt: '2026-11-01T00:00:00Z', // Sat Oct 31, 6 PM Roatán (UTC-6)
  image: '/events/bitcoin-whitepaper-day-2026.jpg',
  rsvpUrl: 'https://www.satlantis.io/events/1002944/bitcoin-whitepaper-day',
  mapUrl: 'https://maps.google.com/?cid=10058184155730079059',
  en: {
    label: 'Featured event',
    title: 'Bitcoin Whitepaper Day 📜',
    when: 'Saturday, October 31 · 2–6 PM',
    where: "Cargo's Dockside, French Harbour",
    intro:
      'The Bitcoin whitepaper turns 18. Come read it with us and get it explained: it is one of the most important documents of our time, and not that difficult to understand.',
    items: [
      '🍔 Lunch, beer, wings and whatnot',
      '📜 Whitepaper explainer',
      '🛠️ Updates from Bitcoin (de)Center, Roatán Bitcoin Bar Poker, Bitcoin District and Builders Node',
      '🤝 Networking',
    ],
    rsvp: 'RSVP on Satlantis',
    map: 'Map',
    hosts: 'Bitcoin District · Bitcoin Roatán · AmityAge Academy',
  },
  es: {
    label: 'Evento destacado',
    title: 'Día del Whitepaper de Bitcoin 📜',
    when: 'Sábado 31 de octubre · 2–6 PM',
    where: "Cargo's Dockside, French Harbour",
    intro:
      'El whitepaper de Bitcoin cumple 18 años. Ven a leerlo con nosotros y que te lo expliquen: es uno de los documentos más importantes de nuestro tiempo, y no es tan difícil de entender.',
    items: [
      '🍔 Almuerzo, cerveza, alitas y más',
      '📜 Explicación del whitepaper',
      '🛠️ Novedades de Bitcoin (de)Center, Roatán Bitcoin Bar Poker, Bitcoin District y Builders Node',
      '🤝 Networking',
    ],
    rsvp: 'Confirma en Satlantis',
    map: 'Mapa',
    hosts: 'Bitcoin District · Bitcoin Roatán · AmityAge Academy',
  },
};

export function FeaturedEventBlock({ className = '' }: { className?: string }) {
  const { language } = useLanguage();
  if (Date.now() > Date.parse(EVENT.endsAt)) return null;
  const c = language === 'es' ? EVENT.es : EVENT.en;

  return (
    <article
      className={`w-full text-left overflow-hidden rounded-xl border border-[hsl(25,95%,55%,0.4)] bg-white/5 backdrop-blur-sm ${className}`}
    >
      <a href={EVENT.rsvpUrl} target="_blank" rel="noopener noreferrer">
        <img
          src={EVENT.image}
          alt={`${c.title}: ${c.when}, ${c.where}`}
          width={1200}
          height={675}
          loading="lazy"
          decoding="async"
          className="w-full aspect-video object-cover"
        />
      </a>
      <div className="p-4 sm:p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(25,95%,65%)]">
          {c.label}
        </span>
        <h3 className="text-xl font-bold text-white mt-1 mb-2">{c.title}</h3>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-4 gap-y-1 text-sm text-white/80 mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-white/50" /> {c.when}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-white/50" /> {c.where}
          </span>
        </div>
        <p className="text-sm text-[hsl(210,40%,75%)] leading-relaxed mb-3">{c.intro}</p>
        <ul className="space-y-1 text-sm text-[hsl(210,40%,75%)] mb-4">
          {c.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 mb-3">
          <a
            href={EVENT.rsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[hsl(25,95%,55%)] hover:bg-[hsl(25,95%,45%)] px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            {c.rsvp} <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href={EVENT.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 hover:border-white/40 px-4 py-2 text-sm text-white/90 transition-colors"
          >
            <MapPin className="w-4 h-4" /> {c.map}
          </a>
        </div>
        <p className="text-xs text-white/50">{c.hosts}</p>
      </div>
    </article>
  );
}
