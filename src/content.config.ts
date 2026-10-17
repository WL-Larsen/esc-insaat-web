import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ICON_NAMES, PROJECT_CATEGORIES, PROJECT_STATUSES } from '@/config/content';

const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      status: z.enum(PROJECT_STATUSES),
      category: z.enum(PROJECT_CATEGORIES),
      location: z.string().min(1),
      year: z.number().int(),
      summary: z.string().min(1),
      description: z.string().default(''),
      coverImage: image(),
      gallery: z.array(image()).default([]),
      features: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      isPlaceholder: z.boolean().default(false),
    }),
});

const services = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/services' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    description: z.string().default(''),
    icon: z.enum(ICON_NAMES),
    features: z.array(z.string()).default([]),
    order: z.number().int().default(0),
  }),
});

const iconItem = z.object({ title: z.string(), text: z.string(), icon: z.enum(ICON_NAMES) });
const textItem = z.object({ title: z.string(), text: z.string() });

const settings = defineCollection({
  loader: glob({ pattern: 'site.yaml', base: './src/content/settings' }),
  schema: z.object({
    companyName: z.string(),
    tagline: z.string(),
    email: z.email(),
    phone: z.string().default(''),
    address: z.string().default(''),
    workingHours: z.string().default(''),
    social: z
      .object({
        instagram: z.string().default(''),
        facebook: z.string().default(''),
        linkedin: z.string().default(''),
        youtube: z.string().default(''),
        x: z.string().default(''),
      })
      .default({ instagram: '', facebook: '', linkedin: '', youtube: '', x: '' }),
  }),
});

const home = defineCollection({
  loader: glob({ pattern: 'home.yaml', base: './src/content/pages' }),
  schema: z.object({
    hero: z.object({ eyebrow: z.string(), title: z.string(), subtitle: z.string() }),
    stats: z.array(z.object({ value: z.string(), label: z.string() })),
    whyUs: z.array(iconItem),
    process: z.array(textItem),
    cta: z.object({ title: z.string(), text: z.string() }),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: 'about.yaml', base: './src/content/pages' }),
  schema: z.object({
    intro: z.object({ title: z.string(), text: z.string() }),
    story: z.string(),
    vision: z.string(),
    mission: z.string(),
    values: z.array(iconItem),
    timeline: z.array(z.object({ year: z.string(), title: z.string(), text: z.string() })),
  }),
});

export const collections = { projects, services, settings, home, about };
