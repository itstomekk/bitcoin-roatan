// Post-build step: gives every route its own static <head> (title, description, canonical,
// Open Graph, Twitter), writes sitemap.xml, and adds dist/404.html so unknown URLs return a real 404.
// Source of truth for the text: src/data/seoPages.json (also used by src/components/Seo.tsx).
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const seo = JSON.parse(readFileSync(join(root, 'src/data/seoPages.json'), 'utf8'));
const { origin, image, imageWidth, imageHeight, imageAlt } = seo.site;
const MARKER = '<!--SEO-->';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const template = readFileSync(join(dist, 'index.html'), 'utf8');
if (!template.includes(MARKER)) throw new Error(`dist/index.html has no ${MARKER} marker (see index.html)`);

const imageUrl = `${origin}${image}`;

function head({ title, description, path }) {
  const url = `${origin}${path}`;
  return [
    `<title>${esc(title)}</title>`,
    `<meta data-rh="true" name="description" content="${esc(description)}" />`,
    `<link data-rh="true" rel="canonical" href="${url}" />`,
    `<meta data-rh="true" property="og:title" content="${esc(title)}" />`,
    `<meta data-rh="true" property="og:description" content="${esc(description)}" />`,
    `<meta data-rh="true" property="og:url" content="${url}" />`,
    `<meta data-rh="true" property="og:image" content="${imageUrl}" />`,
    `<meta data-rh="true" property="og:image:width" content="${imageWidth}" />`,
    `<meta data-rh="true" property="og:image:height" content="${imageHeight}" />`,
    `<meta data-rh="true" property="og:image:alt" content="${esc(imageAlt)}" />`,
    `<meta data-rh="true" name="twitter:title" content="${esc(title)}" />`,
    `<meta data-rh="true" name="twitter:description" content="${esc(description)}" />`,
    `<meta data-rh="true" name="twitter:image" content="${imageUrl}" />`,
    `<meta data-rh="true" name="twitter:image:alt" content="${esc(imageAlt)}" />`,
  ].join('\n    ');
}


// --- Places structured data -------------------------------------------------------------
// Pulls the live BTCMap-synced list of places and writes it into the home page as JSON-LD
// (ItemList of LocalBusiness subtypes) plus a crawlable <noscript> list. If the API is not
// reachable the build still succeeds, just without this block.
const PLACES_URL = process.env.PLACES_URL || 'https://bitcoin-roatan.pages.dev/api/places';
const SCHEMA_TYPE = {
  restaurant: 'Restaurant', cafe: 'CafeOrCoffeeShop', bar: 'BarOrPub', hotel: 'Hotel', shop: 'Store',
  dive_centre: 'SportsActivityLocation', school: 'School', doctors: 'Physician', dentist: 'Dentist',
  atm: 'AutomatedTeller', animal_shelter: 'AnimalShelter',
};
const DAYS = 'Mo|Tu|We|Th|Fr|Sa|Su';
const HOURS_RE = new RegExp(`^(?:${DAYS})(?:-(?:${DAYS}))?(?:,(?:${DAYS})(?:-(?:${DAYS}))?)* \\d\\d:\\d\\d-\\d\\d:\\d\\d$`);
const hoursOf = (h) => {
  if (!h) return undefined;
  if (h.trim() === '24/7') return 'Mo-Su 00:00-24:00';
  const parts = h.split(';').map((x) => x.trim()).filter(Boolean);
  return parts.length && parts.every((x) => HOURS_RE.test(x)) ? parts : undefined;
};
const jsonLd = (o) => JSON.stringify(o).replace(/</g, '\u003c');

async function placesBlock() {
  try {
    const res = await fetch(PLACES_URL, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const places = (await res.json()).places;
    if (!Array.isArray(places) || places.length < 10) throw new Error('too few places');
    const items = places.map((p, i) => {
      const [kind, osmId] = String(p.id).split('-');
      const pay = p.payment_onchain ? 'Bitcoin (Lightning Network and on-chain)' : 'Bitcoin (Lightning Network)';
      const item = {
        '@type': SCHEMA_TYPE[p.category] || 'LocalBusiness',
        name: p.name,
        address: {
          '@type': 'PostalAddress',
          ...(p.address ? { streetAddress: p.address } : {}),
          addressLocality: 'Roatán',
          addressRegion: 'Islas de la Bahía',
          addressCountry: 'HN',
        },
        geo: { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lng },
        paymentAccepted: pay,
        sameAs: `https://btcmap.org/merchant/${kind}:${osmId}`,
      };
      if (p.phone) item.telephone = p.phone;
      if (p.website && /^https?:\/\//.test(p.website)) item.url = p.website;
      const oh = hoursOf(p.opening_hours);
      if (oh) item.openingHours = oh;
      return { '@type': 'ListItem', position: i + 1, item };
    });
    const ld = `<script type="application/ld+json">${jsonLd({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Places that accept Bitcoin on Roatán',
      numberOfItems: items.length,
      itemListElement: items,
    })}</script>`;
    const list = places
      .map((p) => `<li>${esc(p.name)}${p.address ? ` (${esc(p.address)})` : ''}, ${esc(String(p.category).replace(/_/g, ' '))}</li>`)
      .join('');
    console.log(`prerender: ${places.length} places -> JSON-LD + noscript list`);
    return { ld, list: `<h2>Places that accept Bitcoin on Roatán</h2><ul>${list}</ul>` };
  } catch (e) {
    console.warn(`prerender: places block skipped (${e.message})`);
    return null;
  }
}
const places = await placesBlock();

const render = (block) => template.replace(MARKER, block);

for (const [key, page] of Object.entries(seo.pages)) {
  let html = render(head(page));
  if (page.path === '/' && places) {
    html = html.replace('</head>', `    ${places.ld}
  </head>`).replace('</noscript>', `${places.list}
    </noscript>`);
  }
  if (page.path === '/') {
    writeFileSync(join(dist, 'index.html'), html);
  } else {
    // why.html (not why/index.html): Pages serves it at /why with no trailing-slash redirect.
    writeFileSync(join(dist, `${page.path.replace(/^\//, '')}.html`), html);
  }
  console.log(`prerender: ${key} -> ${page.path}`);
}

// 404 page: the SPA still boots and shows its NotFound route, but crawlers get status 404 + noindex.
const notFound = render(
  [
    '<title>Page not found | Bitcoin Roatán</title>',
    '<meta name="robots" content="noindex" />',
  ].join('\n    '),
).replace('<meta name="robots" content="index, follow" />', '');
writeFileSync(join(dist, '404.html'), notFound);
console.log('prerender: 404.html');

const today = new Date().toISOString().slice(0, 10);
const urls = Object.values(seo.pages)
  .map(
    (p) =>
      `  <url>\n    <loc>${origin}${p.path}</loc>\n    <lastmod>${p.lastmod || today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
  )
  .join('\n');
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log('prerender: sitemap.xml');
