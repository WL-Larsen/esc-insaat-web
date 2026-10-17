import { getCollection, getEntry } from 'astro:content';
import type { AboutContent, HomeContent, Service, SiteSettings } from './types';

async function single<T>(collection: 'settings' | 'home' | 'about', id: string): Promise<T> {
  const entry = await getEntry(collection, id);
  if (!entry) throw new Error(`İçerik bulunamadı: src/content/${collection}/${id}.yaml`);
  return entry.data as T;
}

export async function getServices(): Promise<Service[]> {
  const entries = await getCollection('services');
  return entries.map((e) => ({ slug: e.id, ...e.data })).sort((a, b) => a.order - b.order);
}

export const getSiteSettings = () => single<SiteSettings>('settings', 'site');
export const getHomeContent = () => single<HomeContent>('home', 'home');
export const getAboutContent = () => single<AboutContent>('about', 'about');
