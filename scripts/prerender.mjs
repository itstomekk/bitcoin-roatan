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

const render = (block) => template.replace(MARKER, block);

for (const [key, page] of Object.entries(seo.pages)) {
  const html = render(head(page));
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
      `  <url>\n    <loc>${origin}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
  )
  .join('\n');
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log('prerender: sitemap.xml');
