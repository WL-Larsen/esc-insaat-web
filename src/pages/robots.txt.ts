import type { APIRoute } from 'astro';
import { isDemo } from '@/config/site';

// Demo modunda tüm site arama motorlarına kapalıdır.
export const GET: APIRoute = () =>
  new Response(isDemo ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
