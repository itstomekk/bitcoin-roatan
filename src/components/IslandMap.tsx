import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { Search, Shuffle, ExternalLink, Navigation, MapPin } from 'lucide-react';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';

// Full-width BTCMap-powered browser for the landing page. Data comes from our own
// /api/places (a D1 copy of every BTCMap element on Roatán, kept fresh by /api/sync-btcmap).

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

type GroupKey = 'all' | 'food' | 'cafe' | 'bar' | 'shop' | 'stay' | 'atm' | 'service' | 'more';

const GROUPS: { key: GroupKey; icon: string; label: string }[] = [
  { key: 'all', icon: '📍', label: 'All' },
  { key: 'food', icon: '🍽️', label: 'Food' },
  { key: 'cafe', icon: '☕', label: 'Café' },
  { key: 'bar', icon: '🍺', label: 'Bar' },
  { key: 'shop', icon: '🛒', label: 'Shops' },
  { key: 'stay', icon: '🏨', label: 'Stay' },
  { key: 'atm', icon: '🏧', label: 'ATM' },
  { key: 'service', icon: '💼', label: 'Services' },
  { key: 'more', icon: '🌴', label: 'More' },
];

const GROUP_OF: Record<string, GroupKey> = {
  restaurant: 'food',
  cafe: 'cafe',
  bar: 'bar',
  shop: 'shop',
  hotel: 'stay',
  atm: 'atm',
  service: 'service',
  doctors: 'service',
  dentist: 'service',
  post_depot: 'service',
  school: 'service',
  community_centre: 'service',
};

// Specific icons for the long tail of OSM categories; everything else falls back to its group icon.
const CATEGORY_ICON: Record<string, string> = {
  dive_centre: '🤿',
  school: '🎓',
  doctors: '🩺',
  dentist: '🦷',
  community_centre: '🏘️',
  animal_shelter: '🐾',
  post_depot: '📦',
};

const CATEGORY_LABEL: Record<string, string> = {
  restaurant: 'Restaurant',
  cafe: 'Café',
  bar: 'Bar',
  shop: 'Shop',
  hotel: 'Stay',
  atm: 'Bitcoin ATM',
  service: 'Service',
  other: 'Local business',
};

const REGIONS = [
  { name: 'Whole island', center: null as [number, number] | null, zoom: 0 },
  { name: 'West Bay', center: [16.2752, -86.5977] as [number, number], zoom: 15 },
  { name: 'West End', center: [16.3047, -86.5929] as [number, number], zoom: 15 },
  { name: 'Coxen Hole', center: [16.3211, -86.5383] as [number, number], zoom: 15 },
  { name: 'Próspera & Pristine Bay', center: [16.3715, -86.468] as [number, number], zoom: 14 },
  { name: 'Punta Gorda', center: [16.4024, -86.381] as [number, number], zoom: 15 },
];

type TileKey = 'dark' | 'street' | 'satellite';

// Keyless sources only. "dark" is the standard OSM layer recoloured with a CSS filter
// (CARTO's dark tiles now demand an API key).
const TILES: Record<TileKey, { url: string; attribution: string; className?: string; maxZoom: number; label: string }> = {
  dark: {
    label: 'Dark',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    className: 'isl-dark-tiles',
    maxZoom: 19,
  },
  street: {
    label: 'Street',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 18,
  },
};

const makeTiles = (k: TileKey) =>
  L.tileLayer(TILES[k].url, {
    attribution: TILES[k].attribution,
    className: TILES[k].className,
    maxZoom: TILES[k].maxZoom,
    maxNativeZoom: k === 'satellite' ? 17 : 19,
  });

const groupOf = (p: Place): GroupKey => GROUP_OF[p.category] ?? 'more';
const iconOf = (p: Place) =>
  CATEGORY_ICON[p.category] ?? GROUPS.find((g) => g.key === groupOf(p))?.icon ?? '📍';
const labelOf = (p: Place) =>
  CATEGORY_LABEL[p.category] ??
  p.category.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const safeUrl = (u: string | null) => {
  if (!u) return null;
  const withProto = /^https?:\/\//i.test(u) ? u : `https://${u}`;
  try {
    const parsed = new URL(withProto);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : null;
  } catch {
    return null;
  }
};

const btcmapUrl = (p: Place) => {
  const m = /^(node|way|relation)-(\d+)$/.exec(p.id);
  return m ? `https://btcmap.org/merchant/${m[1]}:${m[2]}` : 'https://btcmap.org/map';
};

function markerIcon(p: Place, active: boolean) {
  const size = active ? 34 : 28;
  return L.divIcon({
    html: `<div class="isl-pin${active ? ' isl-pin-active' : ''}">${iconOf(p)}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function popupHtml(p: Place) {
  const site = safeUrl(p.website);
  const dir = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
  const rows = [
    p.address ? `<div class="isl-pop-row">📍 ${esc(p.address)}</div>` : '',
    p.opening_hours ? `<div class="isl-pop-row">🕐 ${esc(p.opening_hours)}</div>` : '',
    p.phone ? `<div class="isl-pop-row">📞 <a href="tel:${esc(p.phone.replace(/[^+\d]/g, ''))}">${esc(p.phone)}</a></div>` : '',
  ].join('');
  const badges = [
    p.payment_lightning ? '<span class="isl-badge isl-badge-ln">⚡ Lightning</span>' : '',
    p.payment_onchain ? '<span class="isl-badge isl-badge-oc">₿ On-chain</span>' : '',
  ].join('');
  return `
    <div class="isl-pop">
      <div class="isl-pop-title">${iconOf(p)} ${esc(p.name)}</div>
      <div class="isl-pop-cat">${esc(labelOf(p))}</div>
      ${badges ? `<div class="isl-pop-badges">${badges}</div>` : ''}
      ${rows}
      <div class="isl-pop-links">
        ${site ? `<a href="${esc(site)}" target="_blank" rel="noopener noreferrer">Website</a>` : ''}
        <a href="${esc(dir)}" target="_blank" rel="noopener noreferrer">Directions</a>
        <a href="${esc(btcmapUrl(p))}" target="_blank" rel="noopener noreferrer">BTC Map</a>
      </div>
    </div>`;
}

// Haversine-lite: good enough for sorting nearby places on a 50 km island.
const distKm = (aLat: number, aLng: number, bLat: number, bLng: number) => {
  const dy = (aLat - bLat) * 111;
  const dx = (aLng - bLng) * 107;
  return Math.hypot(dx, dy);
};

const fmtDist = (km: number) => (km < 1 ? `${Math.max(10, Math.round(km * 100) * 10)} m` : `${km.toFixed(1)} km`);

export default function IslandMap() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.MarkerClusterGroup | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const markers = useRef<Map<string, L.Marker>>(new Map());
  const listRef = useRef<HTMLUListElement>(null);

  const [places, setPlaces] = useState<Place[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [group, setGroup] = useState<GroupKey>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [tileKey, setTileKey] = useState<TileKey>('dark');
  const [view, setView] = useState<{ bounds: L.LatLngBounds; lat: number; lng: number } | null>(null);
  const [touchActive, setTouchActive] = useState(false);
  const isTouch = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches, []);

  // Load places, then ask the server to pull fresh BTCMap changes (rate-limited server side).
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch('/api/places')
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((d) => {
          if (cancelled) return;
          setPlaces((d.places as Place[]) || []);
          setLoadState('ok');
        })
        .catch(() => !cancelled && setLoadState('error'));
    load();
    fetch('/api/sync-btcmap', { method: 'POST' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && (d.upserted > 0 || d.deleted > 0) && load())
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Create the map once.
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, {
      center: [16.34, -86.5],
      zoom: 11,
      minZoom: 10,
      maxBounds: [
        [16.1, -86.85],
        [16.6, -86.1],
      ],
      scrollWheelZoom: false,
      dragging: !isTouch,
      zoomControl: false,
    });
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    tileRef.current = makeTiles('dark').addTo(map);
    layerRef.current = L.markerClusterGroup({
      maxClusterRadius: 38,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 18,
      iconCreateFunction: (c) =>
        L.divIcon({
          html: `<div class="isl-cluster">${c.getChildCount()}</div>`,
          className: '',
          iconSize: [38, 38],
        }),
    }).addTo(map);
    mapRef.current = map;

    const publishView = () => {
      const c = map.getCenter();
      setView({ bounds: map.getBounds(), lat: c.lat, lng: c.lng });
    };
    map.on('moveend', publishView);
    publishView();

    // The page scrolls, so the wheel only zooms once the user has clicked into the map.
    map.on('click focus', () => !isTouch && map.scrollWheelZoom.enable());
    map.on('mouseout blur', () => map.scrollWheelZoom.disable());

    const markerStore = markers.current;
    return () => {
      map.remove();
      mapRef.current = null;
      markerStore.clear();
    };
  }, [isTouch]);

  // Touch devices: map drag is opt-in so the page stays scrollable.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isTouch) return;
    if (touchActive) map.dragging.enable();
    else map.dragging.disable();
  }, [touchActive, isTouch]);

  // Swap base layer.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    tileRef.current?.remove();
    tileRef.current = makeTiles(tileKey).addTo(map);
    tileRef.current.bringToBack();
    if (map.getZoom() > TILES[tileKey].maxZoom) map.setZoom(TILES[tileKey].maxZoom);
  }, [tileKey]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return places.filter((p) => {
      if (group !== 'all' && groupOf(p) !== group) return false;
      if (q && !`${p.name} ${p.address ?? ''} ${labelOf(p)}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [places, group, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: places.length };
    places.forEach((p) => {
      const g = groupOf(p);
      c[g] = (c[g] || 0) + 1;
    });
    return c;
  }, [places]);

  const select = useCallback((id: string | null) => setSelected(id), []);

  // Draw markers.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    markers.current.clear();
    filtered.forEach((p) => {
      const m = L.marker([p.lat, p.lng], { icon: markerIcon(p, false), title: p.name, riseOnHover: true });
      m.bindPopup(popupHtml(p), { maxWidth: 260, className: 'isl-popup' });
      m.on('click', () => select(p.id));
      m.on('popupclose', () => setSelected((s) => (s === p.id ? null : s)));
      layer.addLayer(m);
      markers.current.set(p.id, m);
    });
  }, [filtered, select]);

  // Frame the results when filters change (not on every marker click).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || filtered.length === 0) return;
    const bounds = L.latLngBounds(filtered.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: filtered.length === 1 ? 16 : 14 });
  }, [filtered]);

  // Highlight the selected pin.
  const lastSelected = useRef<string | null>(null);
  useEffect(() => {
    const byId = new Map(places.map((p) => [p.id, p]));
    const prev = lastSelected.current && markers.current.get(lastSelected.current);
    const prevPlace = lastSelected.current ? byId.get(lastSelected.current) : undefined;
    if (prev && prevPlace) prev.setIcon(markerIcon(prevPlace, false));
    const cur = selected && markers.current.get(selected);
    const curPlace = selected ? byId.get(selected) : undefined;
    if (cur && curPlace) cur.setIcon(markerIcon(curPlace, true));
    lastSelected.current = selected;
    if (selected) {
      listRef.current?.querySelector(`[data-pid="${CSS.escape(selected)}"]`)?.scrollIntoView({ block: 'nearest' });
    }
  }, [selected, places, filtered]);

  const focusPlace = useCallback(
    (p: Place) => {
      const map = mapRef.current;
      const m = markers.current.get(p.id);
      if (!map || !m) return;
      select(p.id);
      map.closePopup();
      layerRef.current?.zoomToShowLayer(m, () => m.openPopup());
    },
    [select],
  );

  const surprise = () => {
    if (filtered.length === 0) return;
    focusPlace(filtered[Math.floor(Math.random() * filtered.length)]);
  };

  const goRegion = (r: (typeof REGIONS)[number]) => {
    const map = mapRef.current;
    if (!map) return;
    map.closePopup();
    if (!r.center) {
      if (filtered.length) {
        map.flyToBounds(L.latLngBounds(filtered.map((p) => [p.lat, p.lng] as [number, number])), { padding: [40, 40], maxZoom: 14 });
      }
      return;
    }
    map.flyTo(r.center, r.zoom, { duration: 1 });
  };

  // "In view" list, nearest to the map centre first.
  const visible = useMemo(() => {
    if (!view) return filtered;
    return filtered
      .filter((p) => view.bounds.contains([p.lat, p.lng]))
      .map((p) => ({ p, d: distKm(p.lat, p.lng, view.lat, view.lng) }))
      .sort((a, b) => a.d - b.d)
      .map((x) => x.p);
  }, [filtered, view]);

  return (
    <section aria-labelledby="island-map-title" className="relative z-10 w-full bg-[hsl(210,60%,7%,0.92)] backdrop-blur-sm border-t border-white/10">
      <style>{ISLAND_CSS}</style>

      <div className="max-w-5xl mx-auto px-6 pt-10 pb-5">
        <h2 id="island-map-title" className="text-2xl sm:text-3xl font-bold text-white text-center">
          Browse the island
        </h2>
        <p className="text-center text-[hsl(210,40%,70%)] mt-2 text-sm sm:text-base">
          {loadState === 'ok'
            ? `${places.length} places on Roatán accept Bitcoin. Live from BTC Map.`
            : 'Places on Roatán that accept Bitcoin. Live from BTC Map.'}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5 items-center justify-center" role="group" aria-label="Jump to an area">
          <span className="text-xs text-white/60 mr-1">Jump to:</span>
          {REGIONS.map((r) => (
            <button
              key={r.name}
              onClick={() => goRegion(r)}
              className="text-xs px-2.5 py-1 rounded-full border border-white/15 text-[hsl(210,40%,80%)] hover:bg-white/10 transition-colors"
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(300px,380px)_minmax(0,1fr)] border-y border-white/10">
        <div className="order-2 lg:order-1 min-w-0 flex flex-col min-h-0 lg:h-[680px] bg-[hsl(210,60%,9%)]">
          <div className="px-4 py-2.5 text-xs text-white/60 border-b border-white/10 flex justify-between">
            <span>
              {loadState === 'loading' && 'Loading places…'}
              {loadState === 'error' && 'Could not load places.'}
              {loadState === 'ok' && `${visible.length} in view · nearest to the centre first`}
            </span>
            {group !== 'all' || query ? (
              <button
                className="underline hover:text-white"
                onClick={() => {
                  setGroup('all');
                  setQuery('');
                }}
              >
                Clear filters
              </button>
            ) : null}
          </div>
          <ul ref={listRef} className="overflow-y-auto max-h-[420px] lg:max-h-none lg:flex-1 divide-y divide-white/5">
            {visible.map((p) => {
              const d = view ? distKm(p.lat, p.lng, view.lat, view.lng) : null;
              return (
                <li key={p.id} data-pid={p.id}>
                  <button
                    onClick={() => focusPlace(p)}
                    className={`w-full text-left px-4 py-2.5 flex gap-3 items-start transition-colors ${
                      selected === p.id ? 'bg-[hsl(25,95%,55%,0.18)]' : 'hover:bg-white/[0.06]'
                    }`}
                  >
                    <span className="text-xl leading-none mt-0.5">{iconOf(p)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-white truncate">{p.name}</span>
                      <span className="block text-xs text-white/60 truncate">
                        {labelOf(p)}
                        {p.address ? ` · ${p.address}` : ''}
                      </span>
                    </span>
                    {d !== null && <span className="text-[11px] text-white/45 mt-1 whitespace-nowrap">{fmtDist(d)}</span>}
                  </button>
                </li>
              );
            })}
            {loadState === 'ok' && visible.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-white/60">
                Nothing in this part of the map. Zoom out or pick another area.
              </li>
            )}
          </ul>
        </div>

        <div className="order-1 lg:order-2 min-w-0 relative h-[62vh] min-h-[420px] lg:h-[680px]">
          <div ref={mapEl} className="isl-map absolute inset-0" aria-label="Map of Bitcoin-accepting places on Roatán" />
          <div className="absolute top-3 left-3 right-3 z-[500] flex flex-col gap-2 pointer-events-none">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1 min-w-0 max-w-md pointer-events-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a place, street or type…"
                  aria-label="Search places"
                  className="w-full h-10 pl-9 pr-3 rounded-md bg-black/75 backdrop-blur border border-white/25 text-white placeholder:text-white/65 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(25,95%,55%)]"
                />
              </div>
              <button
                onClick={surprise}
                disabled={filtered.length === 0}
                aria-label="Surprise me"
                className="pointer-events-auto h-10 px-3 sm:px-4 rounded-md bg-[hsl(25,95%,55%)] hover:bg-[hsl(25,95%,47%)] disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2 whitespace-nowrap shadow-lg"
              >
                <Shuffle className="w-4 h-4" /> <span className="hidden sm:inline">Surprise me</span>
              </button>
              <div
                className="pointer-events-auto ml-auto flex rounded-md overflow-hidden border border-white/25 bg-black/75 backdrop-blur text-xs"
                role="group"
                aria-label="Map style"
              >
                {(Object.keys(TILES) as TileKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setTileKey(k)}
                    aria-pressed={tileKey === k}
                    className={`h-10 px-2 sm:px-2.5 ${tileKey === k ? 'bg-[hsl(25,95%,55%)] text-white' : 'text-white/85 hover:bg-white/15'}`}
                  >
                    {TILES[k].label}
                  </button>
                ))}
              </div>
            </div>
            <div
              className="pointer-events-auto flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="group"
              aria-label="Filter by type"
            >
              {GROUPS.filter((g) => g.key === 'all' || counts[g.key]).map((g) => (
                <button
                  key={g.key}
                  onClick={() => setGroup(g.key)}
                  aria-pressed={group === g.key}
                  className={`shrink-0 whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 shadow-md ${
                    group === g.key
                      ? 'bg-[hsl(25,95%,55%)] border-[hsl(25,95%,55%)] text-white'
                      : 'bg-black/75 backdrop-blur border-white/25 text-white/90 hover:bg-black/90'
                  }`}
                >
                  <span>{g.icon}</span>
                  <span>{g.label}</span>
                  <span className="opacity-70">{counts[g.key] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>
          {isTouch && (
            <button
              onClick={() => setTouchActive((a) => !a)}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[500] px-4 h-9 rounded-full bg-black/70 border border-white/25 text-white text-xs font-medium"
            >
              {touchActive ? 'Done · scroll the page' : 'Tap to move the map'}
            </button>
          )}
          {loadState === 'error' && (
            <div className="absolute inset-0 z-[600] bg-black/70 flex flex-col items-center justify-center gap-3 text-white text-sm">
              <MapPin className="w-6 h-6" />
              Could not load the places.
              <a className="underline" href="https://btcmap.org/map#12/16.34156/-86.41727" target="_blank" rel="noopener noreferrer">
                Open the map on BTC Map
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap gap-x-6 gap-y-2 justify-center text-xs text-white/65">
        <a className="hover:text-white inline-flex items-center gap-1" href="https://btcmap.org/add-location" target="_blank" rel="noopener noreferrer">
          <Navigation className="w-3 h-3" /> Know a place that takes Bitcoin? Add it on BTC Map
        </a>
        <a className="hover:text-white inline-flex items-center gap-1" href="https://btcmap.org/map#12/16.34156/-86.41727" target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-3 h-3" /> Open the full BTC Map
        </a>
      </div>
    </section>
  );
}

const ISLAND_CSS = `
.isl-pin{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:15px;line-height:1;
  background:#fff;border:2px solid hsl(25,95%,55%);border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.55);transition:transform .15s}
.isl-pin:hover{transform:scale(1.15)}
.isl-pin-active{font-size:18px;background:hsl(25,95%,55%);border-color:#fff;box-shadow:0 0 0 4px hsl(25 95% 55% / .35),0 2px 10px rgba(0,0,0,.6)}
.isl-dark-tiles{filter:invert(1) hue-rotate(180deg) brightness(.92) contrast(.88) saturate(.55)}
.isl-cluster{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 13px system-ui,sans-serif;
  color:#fff;background:hsl(25 95% 50% / .92);border:3px solid hsl(25 95% 75% / .55);box-shadow:0 2px 10px rgba(0,0,0,.6)}
.leaflet-container{background:#101820}
.isl-map .leaflet-bottom.leaflet-right{margin-right:72px}
.isl-popup .leaflet-popup-content{margin:12px 14px}
.isl-pop{font-family:system-ui,sans-serif;min-width:190px;color:#1f2937}
.isl-pop-title{font-size:14px;font-weight:700;line-height:1.25}
.isl-pop-cat{font-size:11px;color:#6b7280;margin:2px 0 6px}
.isl-pop-badges{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px}
.isl-badge{font-size:10px;padding:1px 6px;border-radius:999px}
.isl-badge-ln{background:#fef3c7;color:#92400e}
.isl-badge-oc{background:#ffedd5;color:#9a3412}
.isl-pop-row{font-size:12px;color:#4b5563;margin-top:2px}
.isl-pop-row a{color:#2563eb}
.isl-pop-links{display:flex;gap:12px;margin-top:9px;padding-top:7px;border-top:1px solid #e5e7eb;font-size:12px}
.isl-pop-links a{color:#c2410c;font-weight:600;text-decoration:none}
.isl-pop-links a:hover{text-decoration:underline}
`;
