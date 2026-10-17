// Sabit seçenek listeleri — panel şeması ve içerik doğrulaması bu listeleri kullanır.
// Yeni kategori eklemek: listeye değer + src/i18n/tr.ts içine etiket ekle.

export const PROJECT_CATEGORIES = ['residential', 'land', 'renovation', 'commercial'] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES = ['ongoing', 'completed'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const ICON_NAMES = [
  'building',
  'urban',
  'land',
  'renovation',
  'clock',
  'shield',
  'check',
  'handshake',
] as const;
export type IconName = (typeof ICON_NAMES)[number];
