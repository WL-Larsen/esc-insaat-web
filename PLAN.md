# ESC İnşaat — Proje Planı

## 1. Kapsam

### İlk sürüm (yerel)
- Sayfalar: Ana Sayfa, Hakkımızda, Projeler (liste + detay), Hizmetler, İletişim, 404
- Projeler: durum filtresi (Tamamlanan / Devam Eden), detay sayfasında galeri
- İletişim: e-posta (mailto) ve sosyal medya bağlantıları
- Yönetim paneli (yalnızca yerel): proje ekle / düzenle / sil, fotoğraf yükle;
  hizmetler, hakkımızda, ana sayfa metinleri ve site ayarları (iletişim, sosyal medya)
- Dil: yalnızca Türkçe (çok dile hazır yapı)
- Geçici marka kimliği (koyu lacivert, bakır, açık gri; metin logo "ESC İnşaat")
- Temsili görseller

### Öncelikler
1. Mobil deneyim (en önemli)
2. Müşterinin gördüğü sitenin görsel kalitesi
3. Sade ve kullanışlı panel (görsel özelleştirme yok)

### Kapsam dışı (sonraki sürümler)
- İletişim formu, WhatsApp butonu
- İngilizce / Rusça
- Emlak ilanları, gelişmiş filtreleme, veritabanı

## 2. Mimari

    Keystatic paneli ──yazar──► src/content/*.yaml|.mdoc + src/assets/
                                        │
                           src/content.config.ts (şema doğrulama)
                                        │
                        src/lib/data/  ◄── tek veri erişim katmanı
                                        │
                     src/pages + components ──► statik HTML (dist/)

**Veritabanına hazırlık:** Sayfalar veriyi yalnızca `src/lib/data/` üzerinden alır.
Fonksiyonlar tipli, sade veri nesneleri döndürür (Astro'ya özgü nesneler sayfalara
sızdırılmaz). Geçişin kapsamı için bkz. Riskler.

**Çok dile hazırlık:** Astro i18n `defaultLocale: 'tr'`, `prefixDefaultLocale: false`.
Arayüz metinleri `src/i18n/tr.ts` içinde. EN/RU eklenince `/en/...`, `/ru/...` açılır;
Türkçe URL'ler değişmez.

**Marka değişimine hazırlık:** Renk, font, radius `global.css` tokenlarında; logo
yalnızca `Logo.astro` içinde. Gerçek logo/renkler gelince yalnızca bu iki yer değişir.

**Kategori genişletme:** Kategoriler `src/config/categories.ts` içinde tek listede.
Yeni kategori = listeye bir satır. İleride kategorilerin panelden yönetilmesi istenirse
ayrı bir koleksiyona dönüştürülür.

### İçerik modeli

**Proje (`projects`, koleksiyon)**
| Alan | Tür | Not |
|---|---|---|
| title | metin | zorunlu |
| slug | metin | başlıktan otomatik |
| status | seçim | `completed` / `ongoing` |
| category | seçim | konut / arsa / tadilat / ticari (genişletilebilir) |
| location | metin | il / ilçe |
| year | sayı | tamamlanma veya başlangıç yılı |
| summary | metin | kart açıklaması (kısa) |
| description | zengin metin | detay sayfası |
| coverImage | görsel | zorunlu |
| gallery | görsel listesi | opsiyonel |
| features | metin listesi | ör. "120 daire", "Kapalı otopark" |
| featured | evet/hayır | ana sayfada göster |
| isPlaceholder | evet/hayır | "Temsili görsel" etiketi |

**Hizmet (`services`, koleksiyon):** title, slug, summary, description, icon, order
**Tekil sayfalar (singleton):** `siteSettings` (firma adı, e-posta, telefon, adres,
sosyal medya), `home` (hero metni, güven göstergeleri), `about` (hakkımızda, değerler)

## 3. Aşamalar
Her aşama sonunda çalışan bir sonuç ve kontrol adımları vardır. Sonraki aşamaya
kullanıcı onayıyla geçilir.

### Faz A — Yerel geliştirme

- [ ] **Aşama 0 — Depo hazırlığı**
  - Yerel: `git init` (`main` dalı), `.gitignore`, CLAUDE.md, PLAN.md, ilk commit
  - GitHub: **private** `esc-insaat-web` deposu ve ilk push (**ayrı onayla**)
  - ✅ Kontrol: `git log` ilk commit'i gösterir; depo GitHub'da "Private" etiketli.

- [ ] **Aşama 1 — Proje iskeleti**
  - Astro + TypeScript kurulumu, Tailwind entegrasyonu
  - Temel layout: header (mobil hamburger menü), footer
  - 5 sayfa + 404 için boş şablonlar, Türkçe URL'ler
  - ✅ Kontrol: `npm run dev` çalışır; tüm sayfalar arasında mobil ve masaüstünde
    gezinilir; menü telefonda açılıp kapanır.

- [ ] **Aşama 2 — Geçici marka kimliği ve tasarım sistemi**
  - Renk tokenları (lacivert / bakır / açık gri), tipografi (Kiril destekli,
    self-hosted font), boşluk ve radius tokenları
  - Metin tabanlı geçici logo (`Logo.astro`)
  - Temel bileşenler: Button, Container, SectionHeading, Card
  - Temsili görseller (nötr SVG, "Temsili görsel" etiketli)
  - ✅ Kontrol: Tek bir token değişince tüm sitenin rengi değişir.

- [ ] **Aşama 3 — İçerik modeli ve veri katmanı**
  - `src/config/` sabit listeleri, `content.config.ts` şemaları, `src/lib/data/`
  - 3–4 temsili proje, 3 hizmet, site ayarları için örnek içerik
  - ✅ Kontrol: Projeler sayfası örnek projeleri listeler; hatalı içerikte derleme
    anlaşılır bir hata verir.

- [ ] **Aşama 4 — Yönetim paneli (Keystatic, yerel mod)**
  - Panel şeması (projeler, hizmetler, tekil sayfalar); varsayılan sade arayüz
  - Görsel yükleme → `src/assets/` altına
  - Panel yalnızca geliştirme ortamında aktif; üretim derlemesine girmez
  - ✅ Kontrol: Panelden proje ekle, fotoğraf yükle, düzenle, sil → değişiklik
    sitede görünür.

- [ ] **Aşama 5 — Sayfa tasarımları**
  - 5a: Ana sayfa (hero, öne çıkan projeler, hizmetler özeti, güven göstergeleri,
    iletişime çağrı)
  - 5b: Projeler listesi (durum filtresi) + proje detay (galeri, özellikler)
  - 5c: Hizmetler, Hakkımızda, İletişim (mailto, sosyal medya)
  - ✅ Kontrol: Her alt aşamada telefon (360px), tablet ve masaüstünde kontrol.

- [ ] **Aşama 6 — SEO, performans ve erişilebilirlik**
  - Başlık/açıklama, Open Graph, `sitemap.xml`, `robots.txt`, favicon, 404
  - ✅ Kontrol: Lighthouse (mobil) Performance, Accessibility, SEO ≥ 90;
    `npm run build` hatasız.

### Faz B — Yayın (maliyetler bu fazda değerlendirilecek)

- [ ] **Aşama 7 — Entegrasyon testi (yayın öncesi doğrulama)**
  - Cloudflare Pages + Keystatic GitHub modu birlikte **çalıştığı varsayılmaz**,
    önce küçük bir testle doğrulanır.
  - Ayrı test dalı veya geçici test deposuyla minimum kurulum:
    Cloudflare adaptörü, GitHub App, panel girişi, içerik kaydı → commit → otomatik
    derleme → yayında görünme; görsel yüklemenin çalışması.
  - Başarı ölçütleri: giriş çalışır, kayıt GitHub'a commit düşer, site 1–2 dakikada
    güncellenir, yetkisiz hesap panele giremez.
  - Başarısızsa değerlendirilecek alternatifler: Keystatic'in farklı barındırma
    sağlayıcısında (Netlify / Vercel) çalıştırılması, Keystatic Cloud, panelin
    yalnızca yerelde kullanılması (içerik yerelde düzenlenip push edilir).
  - ✅ Kontrol: Test sonuç raporu ve seçilen yöntem için kullanıcı onayı.

- [ ] **Aşama 8 — Deployment**
  - GitHub deposunu barındırmaya bağlama; `main` → otomatik yayın
  - Keystatic GitHub modu (Aşama 7'de doğrulanan yöntemle)
  - Ek güvenlik: `/keystatic` önüne Cloudflare Access (yalnızca sizin e-postanız)
  - Gizli anahtarlar barındırma ortam değişkenlerinde
  - ✅ Kontrol: Geçici adreste site açılır; panel değişikliği yayına girer; başka
    hesapla panele girilemez.

- [ ] **Aşama 9 — Domain ve HTTPS**
  - Domain seçimi ve satın alma (.com.tr / .com)
  - DNS yönetimi (Cloudflare), özel domain bağlama
  - HTTPS (otomatik sertifika), `www` ↔ kök yönlendirme, HTTP → HTTPS zorunluluğu
  - Kurumsal e-posta: Cloudflare Email Routing (info@ → kişisel adres) veya
    ücretli e-posta servisi
  - ✅ Kontrol: `https://alanadi` açılır, sertifika geçerli, info@ e-postası ulaşır.

- [ ] **Aşama 10 — İletişim kanalları**
  - İletişim formu (sunucu fonksiyonu + e-posta servisi + Turnstile spam koruması)
  - WhatsApp butonu (değerlendirme sonrası)
  - ✅ Kontrol: Form gönderimi e-postaya ulaşır, bot gönderimleri engellenir.

### Faz C — Genişleme (ihtiyaç doğduğunda)
- **Çok dil (EN/RU):** içerik şemasına dil alanları, `/en`, `/ru` rotaları, `hreflang`
- **Veritabanı ve emlak ilanları:** ilan modeli, veritabanı (ör. Cloudflare D1 veya
  PostgreSQL), filtreleme için sunucu taraflı rotalar; `src/lib/data/` veritabanına
  bağlanır. Kapsam için bkz. Riskler.

## 4. Riskler ve notlar
- **Barındırma + panel entegrasyonu doğrulanmadı.** Cloudflare Pages ile Keystatic
  GitHub modunun sorunsuz çalışacağı varsayılmaz; Aşama 7'de test edilir.
- **Veritabanına geçiş yalnızca veri katmanını değiştirmekten ibaret olmayabilir.**
  Veri katmanı sayfaları korur, ancak geçişte muhtemelen şunlar da değişir:
  - Derleme modu: statik → sunucu taraflı (SSR) veya karma; barındırma maliyeti
  - Yönetim paneli: Keystatic dosya tabanlıdır; ilanlar için veritabanı tabanlı bir
    panel (ör. Payload, Directus veya özel panel) gerekebilir
  - Görsel depolama: depo yerine harici depolama (ör. Cloudflare R2)
  - Mevcut içeriğin aktarımı (migration script), şema sürümleme ve yedekleme
  - Filtreleme arayüzü, sayfalama, önbellekleme ve kimlik doğrulama
  - Bu nedenle geçiş ayrı bir proje fazı olarak planlanıp tahminlenmelidir.
- Panel rotaları sunucu tarafında çalışır; yerelde sorun yok, üretimde adaptör gerekir.
- Çok sayıda yüksek çözünürlüklü fotoğraf depoyu büyütür; yükleme öncesi makul boyut
  önerilir, gerekirse harici görsel depolamaya geçilir.
- Paket sürümleri kurulum anında güncel kararlı sürüm olarak sabitlenir.
