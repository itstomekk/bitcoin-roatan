import { Helmet } from 'react-helmet-async';
import seo from '@/data/seoPages.json';

type PageKey = keyof typeof seo.pages;

interface SeoProps {
  page: PageKey;
}

// Titles, descriptions and paths live in src/data/seoPages.json. The same file feeds
// scripts/prerender.mjs, which writes them into the static HTML of every route at build time.
export const Seo = ({ page }: SeoProps) => {
  const { title, description, path } = seo.pages[page];
  const { origin, image, imageWidth, imageHeight, imageAlt } = seo.site;
  const url = `${origin}${path}`;
  const imageUrl = `${origin}${image}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />
    </Helmet>
  );
};
