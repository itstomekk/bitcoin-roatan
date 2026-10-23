// Shared helpers for Pages Functions.
export interface Env {
  DB: D1Database;
}

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });

// Roatán bounding box (same as the original Lovable edge function)
export const BBOX = { minLat: 16.25, maxLat: 16.55, minLng: -86.65, maxLng: -86.25 };

type Tags = Record<string, string>;

export interface BtcmapElement {
  id: number;
  osm_data?: {
    type?: string;
    id?: number;
    lat?: number;
    lon?: number;
    bounds?: { minlat: number; maxlat: number; minlon: number; maxlon: number };
    tags?: Tags;
  };
  updated_at: string;
  deleted_at?: string;
}

export function coords(el: BtcmapElement): [number, number] | null {
  const o = el.osm_data;
  if (!o) return null;
  if (typeof o.lat === 'number' && typeof o.lon === 'number') return [o.lat, o.lon];
  if (o.bounds) return [(o.bounds.minlat + o.bounds.maxlat) / 2, (o.bounds.minlon + o.bounds.maxlon) / 2];
  return null;
}

export function inRoatan([lat, lng]: [number, number]) {
  return lat >= BBOX.minLat && lat <= BBOX.maxLat && lng >= BBOX.minLng && lng <= BBOX.maxLng;
}

// Same category / payment mapping as the original sync-btcmap function.
export function toPlace(el: BtcmapElement, [lat, lng]: [number, number]) {
  const o = el.osm_data!;
  const tags = o.tags || {};
  let category = 'other';
  if (tags.amenity === 'restaurant' || tags.amenity === 'fast_food') category = 'restaurant';
  else if (tags.amenity === 'cafe') category = 'cafe';
  else if (tags.amenity === 'bar' || tags.amenity === 'pub') category = 'bar';
  else if (tags.shop) category = 'shop';
  else if (['hotel', 'hostel', 'guest_house'].includes(tags.tourism)) category = 'hotel';
  else if (tags.amenity === 'atm' || (tags['payment:bitcoin'] === 'yes' && tags.amenity === 'bureau_de_change')) category = 'atm';
  else if (tags.office || tags.amenity === 'coworking_space') category = 'service';
  else if (tags.amenity) category = tags.amenity;
  return {
    id: `${o.type || 'node'}-${o.id}`,
    name: tags.name || tags['name:en'] || 'Unknown',
    category,
    lat,
    lng,
    address: [tags['addr:street'], tags['addr:housenumber'], tags['addr:city']].filter(Boolean).join(', ') || null,
    phone: tags.phone || tags['contact:phone'] || null,
    website: tags.website || tags['contact:website'] || null,
    opening_hours: tags.opening_hours || null,
    payment_lightning:
      tags['payment:lightning'] === 'yes' || tags['payment:lightning_contactless'] === 'yes' || tags['currency:XBT'] === 'yes' ? 1 : 0,
    payment_onchain: tags['payment:onchain'] === 'yes' || tags['payment:bitcoin'] === 'yes' ? 1 : 0,
    osm_type: o.type || 'node',
    osm_id: o.id ?? null,
    tags: JSON.stringify(tags),
  };
}
