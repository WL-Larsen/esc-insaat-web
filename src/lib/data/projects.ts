import { getCollection, getEntry } from 'astro:content';
import type { ProjectStatus } from '@/config/content';
import type { Project } from './types';

type Entry = NonNullable<Awaited<ReturnType<typeof getEntry<'projects', string>>>>;

const toProject = (entry: Entry): Project => ({ slug: entry.id, ...entry.data });

// Devam eden projeler önce, ardından yeniden eskiye.
const byStatusThenYear = (a: Project, b: Project) =>
  (a.status === b.status ? 0 : a.status === 'ongoing' ? -1 : 1) || b.year - a.year;

export async function getProjects(filter: { status?: ProjectStatus } = {}): Promise<Project[]> {
  const entries = await getCollection('projects');
  return entries
    .map(toProject)
    .filter((p) => !filter.status || p.status === filter.status)
    .sort(byStatusThenYear);
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const entry = await getEntry('projects', slug);
  return entry ? toProject(entry) : undefined;
}
