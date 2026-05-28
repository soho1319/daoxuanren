// @ts-check
import { defineCollection, z } from 'astro:content';
import { remarkWikiLink } from 'remark-wiki-link';
import remarkCallouts from 'remark-callouts';
import remarkGfm from 'remark-gfm';
import rehypeExternalLinks from 'rehype-external-links';

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
