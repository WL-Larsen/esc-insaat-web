// Veri katmanının dışa açtığı tipler. Sayfalar yalnızca bu tipleri bilir;
// veri kaynağı (dosya / veritabanı) değişse de bu sözleşme korunur.
import type { ImageMetadata } from 'astro';
import type { IconName, ProjectCategory, ProjectStatus } from '@/config/content';

// Veritabanına geçişte görseller URL'ye dönüşebilir; bu nedenle tek bir takma ad.
export type ImageAsset = ImageMetadata;

export interface Project {
  slug: string;
  title: string;
  status: ProjectStatus;
  category: ProjectCategory;
  location: string;
  year: number;
  summary: string;
  description: string;
  coverImage: ImageAsset;
  gallery: ImageAsset[];
  features: string[];
  featured: boolean;
  isPlaceholder: boolean;
}

export interface Service {
  slug: string;
  title: string;
  summary: string;
  description: string;
  icon: IconName;
  features: string[];
  order: number;
}

export interface IconItem {
  title: string;
  text: string;
  icon: IconName;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  workingHours: string;
  social: Record<'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'x', string>;
}

export interface HomeContent {
  hero: { eyebrow: string; title: string; subtitle: string };
  stats: { value: string; label: string }[];
  whyUs: IconItem[];
  process: { title: string; text: string }[];
  cta: { title: string; text: string };
}

export interface AboutContent {
  intro: { title: string; text: string };
  story: string;
  vision: string;
  mission: string;
  values: IconItem[];
  timeline: { year: string; title: string; text: string }[];
}
