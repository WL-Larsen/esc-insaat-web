// Yönetim paneli şeması. Alanlar src/content.config.ts ile birebir uyumlu tutulmalı.
import { config, collection, fields, singleton } from '@keystatic/core';
import { ICON_NAMES, PROJECT_CATEGORIES, PROJECT_STATUSES } from '@/config/content';
import { t } from '@/i18n/tr';

const iconLabels: Record<(typeof ICON_NAMES)[number], string> = {
  building: 'Bina',
  urban: 'Kentsel dönüşüm',
  land: 'Arsa',
  renovation: 'Tadilat',
  clock: 'Saat',
  shield: 'Kalkan',
  check: 'Onay işareti',
  handshake: 'El sıkışma',
};

const iconField = (label = 'İkon') =>
  fields.select({
    label,
    options: ICON_NAMES.map((value) => ({ value, label: iconLabels[value] })),
    defaultValue: 'building',
  });

const projectImage = (label: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: 'src/assets/projects',
    publicPath: '../../assets/projects/',
    validation: { isRequired: true },
  });

const required = { validation: { length: { min: 1 } } };

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'ESC İnşaat' },
    navigation: {
      İçerik: ['projects', 'services'],
      Sayfalar: ['home', 'about'],
      Ayarlar: ['site'],
    },
  },

  collections: {
    projects: collection({
      label: 'Projeler',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { data: 'yaml' },
      columns: ['title', 'status', 'year'],
      schema: {
        title: fields.slug({
          name: { label: 'Proje adı', ...required },
          slug: { label: 'URL', description: 'Sayfa adresi: /projeler/<url>. Yayından sonra değiştirmeyin.' },
        }),
        status: fields.select({
          label: 'Durum',
          options: PROJECT_STATUSES.map((value) => ({ value, label: t.status[value] })),
          defaultValue: 'ongoing',
        }),
        category: fields.select({
          label: 'Kategori',
          options: PROJECT_CATEGORIES.map((value) => ({ value, label: t.category[value] })),
          defaultValue: 'residential',
        }),
        location: fields.text({ label: 'Konum', description: 'Örn: Kadıköy, İstanbul', ...required }),
        // Sayı alanı "2,026" gibi gösterdiği için 4 haneli metin olarak tutulur.
        year: fields.text({
          label: 'Yıl',
          description: 'Tamamlanma veya başlangıç yılı (örn: 2026)',
          defaultValue: String(new Date().getFullYear()),
          validation: { isRequired: true, pattern: { regex: /^(19|20)\d{2}$/, message: '4 haneli bir yıl girin (örn: 2026).' } },
        }),
        summary: fields.text({ label: 'Kısa açıklama', description: 'Proje kartında görünür (1–2 cümle).', multiline: true, ...required }),
        description: fields.text({ label: 'Detaylı açıklama', description: 'Paragrafları boş bir satırla ayırın.', multiline: true }),
        coverImage: projectImage('Kapak görseli', 'Önerilen: yatay, en az 1600 px genişlik.'),
        gallery: fields.array(projectImage('Görsel'), { label: 'Galeri', itemLabel: (props) => props.value?.filename ?? 'Görsel' }),
        features: fields.array(fields.text({ label: 'Özellik' }), {
          label: 'Öne çıkan özellikler',
          itemLabel: (props) => props.value || 'Özellik',
        }),
        featured: fields.checkbox({ label: 'Ana sayfada göster', defaultValue: false }),
        isPlaceholder: fields.checkbox({
          label: 'Temsili görsel',
          description: 'İşaretliyse görsellerin üzerinde "Temsili görsel" etiketi görünür.',
          defaultValue: false,
        }),
      },
    }),

    services: collection({
      label: 'Hizmetler',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { data: 'yaml' },
      columns: ['title', 'order'],
      schema: {
        title: fields.slug({ name: { label: 'Hizmet adı', ...required } }),
        summary: fields.text({ label: 'Kısa açıklama', multiline: true, ...required }),
        description: fields.text({ label: 'Detaylı açıklama', description: 'Paragrafları boş bir satırla ayırın.', multiline: true }),
        icon: iconField(),
        features: fields.array(fields.text({ label: 'Madde' }), { label: 'Öne çıkan maddeler', itemLabel: (props) => props.value || 'Madde' }),
        order: fields.integer({ label: 'Sıra', description: 'Küçük sayı önce gösterilir.', defaultValue: 1 }),
      },
    }),
  },

  singletons: {
    site: singleton({
      label: 'Site ayarları',
      path: 'src/content/settings/site',
      format: { data: 'yaml' },
      schema: {
        companyName: fields.text({ label: 'Firma adı', ...required }),
        tagline: fields.text({ label: 'Kısa tanıtım', description: 'Footer ve iletişim sayfasında görünür.', multiline: true }),
        email: fields.text({ label: 'E-posta', ...required }),
        phone: fields.text({ label: 'Telefon' }),
        address: fields.text({ label: 'Adres', multiline: true }),
        workingHours: fields.text({ label: 'Çalışma saatleri' }),
        social: fields.object(
          {
            instagram: fields.url({ label: 'Instagram' }),
            facebook: fields.url({ label: 'Facebook' }),
            linkedin: fields.url({ label: 'LinkedIn' }),
            youtube: fields.url({ label: 'YouTube' }),
            x: fields.url({ label: 'X (Twitter)' }),
          },
          { label: 'Sosyal medya', description: 'Boş bırakılan hesaplar sitede gösterilmez.' },
        ),
      },
    }),

    home: singleton({
      label: 'Ana sayfa',
      path: 'src/content/pages/home',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Üst başlık' }),
            title: fields.text({ label: 'Başlık', ...required }),
            subtitle: fields.text({ label: 'Alt metin', multiline: true }),
          },
          { label: 'Açılış alanı' },
        ),
        stats: fields.array(
          fields.object({ value: fields.text({ label: 'Değer', description: 'Örn: 15+' }), label: fields.text({ label: 'Açıklama' }) }),
          { label: 'Rakamlar', itemLabel: (props) => `${props.fields.value.value} ${props.fields.label.value}` },
        ),
        whyUs: fields.array(
          fields.object({ title: fields.text({ label: 'Başlık' }), text: fields.text({ label: 'Metin', multiline: true }), icon: iconField() }),
          { label: 'Neden biz', itemLabel: (props) => props.fields.title.value || 'Madde' },
        ),
        process: fields.array(
          fields.object({ title: fields.text({ label: 'Başlık' }), text: fields.text({ label: 'Metin', multiline: true }) }),
          { label: 'Çalışma süreci', itemLabel: (props) => props.fields.title.value || 'Adım' },
        ),
        cta: fields.object(
          { title: fields.text({ label: 'Başlık' }), text: fields.text({ label: 'Metin', multiline: true }) },
          { label: 'İletişim çağrısı (sayfa sonları)' },
        ),
      },
    }),

    about: singleton({
      label: 'Hakkımızda',
      path: 'src/content/pages/about',
      format: { data: 'yaml' },
      schema: {
        intro: fields.object(
          { title: fields.text({ label: 'Başlık' }), text: fields.text({ label: 'Giriş metni', multiline: true }) },
          { label: 'Giriş' },
        ),
        story: fields.text({ label: 'Hikayemiz', description: 'Paragrafları boş bir satırla ayırın.', multiline: true }),
        vision: fields.text({ label: 'Vizyon', multiline: true }),
        mission: fields.text({ label: 'Misyon', multiline: true }),
        values: fields.array(
          fields.object({ title: fields.text({ label: 'Başlık' }), text: fields.text({ label: 'Metin', multiline: true }), icon: iconField() }),
          { label: 'Değerler', itemLabel: (props) => props.fields.title.value || 'Değer' },
        ),
        timeline: fields.array(
          fields.object({
            year: fields.text({ label: 'Yıl' }),
            title: fields.text({ label: 'Başlık' }),
            text: fields.text({ label: 'Metin', multiline: true }),
          }),
          { label: 'Zaman çizelgesi', itemLabel: (props) => `${props.fields.year.value} — ${props.fields.title.value}` },
        ),
      },
    }),
  },
});
