// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://daoxuanren.com',
  integrations: [
    mdx(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [
      'remark-gfm',
      'remark-callouts',
      ['remark-wiki-link', { permalink: '/blog/:slug' }],
    ],
    rehypePlugins: [
      ['rehype-external-links', { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
});
