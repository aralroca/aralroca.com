import { defineConfig } from 'janux';

export default defineConfig({
  title: 'Aral Roca',
  // Public origin: opts into /sitemap.xml + /robots.txt and makes canonicals absolute.
  siteUrl: 'https://aralroca.com',
  // `janux build` prerenders every page into dist/client — deployed as static files.
  output: 'static',
  // The stylesheet is small: inlining it removes the only render-blocking request.
  inlineStyles: true,
  navigation: {
    viewTransitions: true,
    speculationRules: {
      eagerness: 'moderate',
      exclude: ['/rss.xml', '/sitemap.xml', '/search.xml'],
    },
  },
});
