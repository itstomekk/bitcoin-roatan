import { useState, useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Search, Zap, Link, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface Place {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address: string | null;
  phone: string | null;
  website: string | null;
  opening_hours: string | null;
  payment_lightning: boolean;
  payment_onchain: boolean;
}

const CATEGORIES = [
  { key: 'all', icon: '📍' },
  { key: 'restaurant', icon: '🍽️' },
  { key: 'cafe', icon: '☕' },
  { key: 'bar', icon: '🍺' },
  { key: 'shop', icon: '🛒' },
  { key: 'hotel', icon: '🏨' },
  { key: 'atm', icon: '🏧' },
  { key: 'service', icon: '💼' },
  { key: 'other', icon: '📌' },
];

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  en: { all: 'All', restaurant: 'Food', cafe: 'Café', bar: 'Bar', shop: 'Shop', hotel: 'Stay', atm: 'ATM', service: 'Service', other: 'Other' },
  es: { all: 'Todo', restaurant: 'Comida', cafe: 'Café', bar: 'Bar', shop: 'Tienda', hotel: 'Hotel', atm: 'Cajero', service: 'Servicio', other: 'Otro' },
};

function getCategoryIcon(category: string) {
  return CATEGORIES.find(c => c.key === category)?.icon || '📌';
}

function createIcon(category: string) {
  const emoji = getCategoryIcon(category);
  return L.divIcon({
    html: `<div style="font-size:18px;text-align:center;line-height:26px;width:26px;height:26px;background:white;border-radius:50%;border:2px solid #333;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${emoji}</div>`,
    className: '',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  });
}

export function MerchantMap() {
  const { language } = useLanguage();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'lightning' | 'onchain'>('all');

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/places');
      if (res.ok) {
        const data = await res.json();
        setPlaces((data.places as Place[]) || []);
      }
    } catch (err) {
      console.error('Places fetch error:', err);
    }
    setLoading(false);
  };

  const syncPlaces = async () => {
    setSyncing(true);
    try {
      await fetch('/api/sync-btcmap', { method: 'POST' });
      await fetchPlaces();
    } catch (err) {
      console.error('Sync error:', err);
    }
    setSyncing(false);
  };

  useEffect(() => {
    fetchPlaces();
    // Background refresh from BTCMap; the server rate-limits this, so it is cheap to call.
    fetch('/api/sync-btcmap', { method: 'POST' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && (d.upserted > 0 || d.deleted > 0)) fetchPlaces();
      })
      .catch(() => {});
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current).setView([16.365, -86.465], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const filtered = useMemo(() => {
    return places.filter(p => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (paymentFilter === 'lightning' && !p.payment_lightning) return false;
      if (paymentFilter === 'onchain' && !p.payment_onchain) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [places, selectedCategory, paymentFilter, search]);

  // Update markers
  useEffect(() => {
    if (!markersRef.current || !mapRef.current) return;
    markersRef.current.clearLayers();

    const labels = CATEGORY_LABELS[language] || CATEGORY_LABELS.en;

    filtered.forEach(place => {
      const marker = L.marker([place.lat, place.lng], { icon: createIcon(place.category) });
      const paymentBadges = [
        place.payment_lightning ? '<span style="background:#fef3c7;color:#92400e;padding:1px 4px;border-radius:3px;font-size:10px;">⚡ Lightning</span>' : '',
        place.payment_onchain ? '<span style="background:#ffedd5;color:#9a3412;padding:1px 4px;border-radius:3px;font-size:10px;">On-chain</span>' : '',
      ].filter(Boolean).join(' ');

      marker.bindPopup(`
        <div style="min-width:160px;font-family:system-ui;">
          <strong style="font-size:13px;">${place.name}</strong><br/>
          <span style="background:#f3f4f6;padding:1px 4px;border-radius:3px;font-size:10px;">${labels[place.category] || place.category}</span>
          ${paymentBadges ? '<br/>' + paymentBadges : ''}
          ${place.address ? `<br/><span style="font-size:11px;color:#666;">📍 ${place.address}</span>` : ''}
          ${place.opening_hours ? `<br/><span style="font-size:11px;color:#888;">🕐 ${place.opening_hours}</span>` : ''}
          ${place.website ? `<br/><a href="${place.website}" target="_blank" rel="noopener" style="font-size:11px;color:#2563eb;">🔗 Website</a>` : ''}
        </div>
      `);
      markersRef.current!.addLayer(marker);
    });

    if (filtered.length > 0) {
      const bounds = L.latLngBounds(filtered.map(p => [p.lat, p.lng] as [number, number]));
      mapRef.current.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
    }
  }, [filtered, language]);

  const labels = CATEGORY_LABELS[language] || CATEGORY_LABELS.en;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={language === 'es' ? 'Buscar negocio...' : 'Search business...'}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${
              selectedCategory === cat.key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border text-foreground hover:bg-muted'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{labels[cat.key]}</span>
          </button>
        ))}
      </div>

      {/* Payment type + sync */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setPaymentFilter('all')}
          className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
            paymentFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-foreground hover:bg-muted'
          }`}
        >
          {language === 'es' ? 'Todos' : 'All'}
        </button>
        <button
          onClick={() => setPaymentFilter('lightning')}
          className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${
            paymentFilter === 'lightning' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-foreground hover:bg-muted'
          }`}
        >
          <Zap className="w-3 h-3" /> Lightning
        </button>
        <button
          onClick={() => setPaymentFilter('onchain')}
          className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${
            paymentFilter === 'onchain' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-foreground hover:bg-muted'
          }`}
        >
          <Link className="w-3 h-3" /> On-chain
        </button>
        <div className="flex-1" />
        <button
          onClick={syncPlaces}
          disabled={syncing}
          className="text-xs px-2 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
        >
          <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Map */}
      <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 xl:-mx-16 2xl:-mx-20 relative">
        {loading && (
          <div className="absolute inset-0 z-[1000] bg-background/60 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        <div ref={mapContainerRef} style={{ height: '520px', width: '100%' }} />
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} {language === 'es' ? 'lugares encontrados' : 'places found'}
        {places.length !== filtered.length && ` (${places.length} ${language === 'es' ? 'total' : 'total'})`}
      </p>
    </div>
  );
}
