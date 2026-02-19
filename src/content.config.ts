import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tracks = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tracks' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    description: z.string(),
    color: z.string(),
    icon: z.string(),
    phase: z.number(),
    order: z.number(),
  }),
});

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    track: z.string(),
    order: z.number(),
    section: z.string().optional(),
    priority: z.enum(['high', 'medium', 'low']).default('medium'),
    tags: z.array(z.string()).default([]),
    prerequisites: z.array(z.string()).default([]),
    keyTakeaways: z.array(z.string()).default([]),
  }),
});

const books = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    category: z.string(),
    priority: z.enum(['essential', 'recommended', 'bonus']).default('recommended'),
    order: z.number(),
    coverColor: z.string().default('#8B5CF6'),
  }),
});

export const collections = { tracks, lessons, books };
