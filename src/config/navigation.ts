import { t } from '@/i18n/tr';

export const navigation = [
  { href: '/', label: t.nav.home },
  { href: '/hakkimizda', label: t.nav.about },
  { href: '/projeler', label: t.nav.projects },
  { href: '/hizmetler', label: t.nav.services },
  { href: '/iletisim', label: t.nav.contact },
] as const;

export function isActive(href: string, pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/';
  return href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);
}
