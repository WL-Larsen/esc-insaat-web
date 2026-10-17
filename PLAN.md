# ESC İnşaat — Proje Planı

## 1. Kapsam

### İlk sürüm (yerel)
- Sayfalar: Ana Sayfa, Hakkımızda, Projeler (liste + detay), Hizmetler, İletişim, 404
- Projeler: durum filtresi (Tamamlanan / Devam Eden), detay sayfasında galeri
- İletişim: e-posta (mailto) ve sosyal medya bağlantıları
- Yönetim paneli (yalnızca yerel): proje ekle / düzenle / sil, fotoğraf yükle;
  hizmetler, hakkımızda, ana sayfa metinleri ve site ayarları (iletişim, sosyal medya)
- Dil: yalnızca Türkçe (çok dile hazır yapı)
- Marka kimliği: firma logosu (kaynak: `D:\ESC insaat gorseller\logo.png`) ve logodan
  türetilen mavi palet (koyu mavi, parlak mavi, lacivert, açık gri)
- Temsili görseller ve örnek (kurgu) içerik — yayından önce gerçekleriyle değiştirilir

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
dosyaları `src/assets/brand/`, kullanımı yalnızca `Logo.astro` içinde.

**Kategori genişletme:** Kategoriler `src/config/content.ts` içinde tek listede.
Yeni kategori = listeye bir değer + `tr.ts` içine etiket. İleride kategorilerin panelden
yönetilmesi istenirse ayrı bir koleksiyona dönüştürülür.

**Uzun metinler:** Açıklamalar çok satırlı düz metin olarak tutulur (boş satır = yeni
paragraf). Zengin metin (kalın, bağlantı, liste) ihtiyacı doğarsa Markdoc'a geçilir.

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
| description | çok satırlı metin | detay sayfası (paragraflar) |
| coverImage | görsel | zorunlu |
| gallery | görsel listesi | opsiyonel |
| features | metin listesi | ör. "120 daire", "Kapalı otopark" |
| featured | evet/hayır | ana sayfada göster |
| isPlaceholder | evet/hayır | "Temsili görsel" etiketi |

**Hizmet (`services`, koleksiyon):** title, slug, summary, description, icon, features, order
**Tekil içerikler:** `settings/site` (firma adı, slogan, e-posta, telefon, adres, çalışma
saatleri, sosyal medya), `pages/home` (hero, rakamlar, neden biz, süreç, CTA),
`pages/about` (giriş, hikaye, vizyon, misyon, değerler, zaman çizelgesi)

## 3. Aşamalar
Her aşama sonunda çalışan bir sonuç ve kontrol adımları vardır. Sonraki aşamaya
kullanıcı onayıyla geçilir.

### Faz A — Yerel geliştirme

- [x] **Aşama 0 — Depo hazırlığı** (tamamlandı: 18.10.2026)
  - Yerel: `git init` (`main` dalı), `.gitignore`, CLAUDE.md, PLAN.md, ilk commit
  - GitHub: **private** `esc-insaat-web` deposu ve ilk push (**ayrı onayla**)
  - ✅ Kontrol: `git log` ilk commit'i gösterir; depo GitHub'da "Private" etiketli.

- [x] **Aşama 1 — Proje iskeleti** (tamamlandı: 18.10.2026; Astro 7.4, Tailwind 4.3, Node 24)
  - Astro + TypeScript kurulumu, Tailwind entegrasyonu
  - Temel layout: header (mobil hamburger menü), footer
  - 5 sayfa + 404 için boş şablonlar, Türkçe URL'ler
  - ✅ Kontrol: `npm run dev` çalışır; tüm sayfalar arasında mobil ve masaüstünde
    gezinilir; menü telefonda açılıp kapanır.

- [x] **Aşama 2 — Marka kimliği ve tasarım sistemi** (tamamlandı: 18.10.2026)
  - Logodan türetilen renk tokenları, Manrope (Kiril destekli, self-hosted),
    radius tokenları
  - Firma logosu (şeffaf zemin, beyaz versiyon, favicon) — `Logo.astro`
  - Temel bileşenler: Button, Container, SectionHeading, Card
  - Temsili görseller (nötr SVG, "Temsili görsel" etiketli)
  - ✅ Kontrol: Tek bir token değişince tüm sitenin rengi değişir.

- [x] **Aşama 3 — İçerik modeli ve veri katmanı** (tamamlandı: 18.10.2026)
  - `src/config/` sabit listeleri, `content.config.ts` şemaları, `src/lib/data/`
  - 6 temsili proje, 4 hizmet, ana sayfa / hakkımızda / site ayarları örnek içeriği
  - ✅ Kontrol: Projeler sayfası örnek projeleri listeler; hatalı içerikte derleme
    anlaşılır bir hata verir.

- [x] **Aşama 4 — Yönetim paneli (Keystatic, yerel mod)** (tamamlandı: 18.10.2026)
  - Panel şeması (projeler, hizmetler, ana sayfa, hakkımızda, site ayarları)
  - Görsel yükleme → `src/assets/projects/<proje>/` (proje silinince görseller de silinir)
  - Panel yalnızca `npm run dev` ile aktif; üretim derlemesine panel ve React girmez
  - Otomatik tarayıcı testiyle doğrulandı: ekle (fotoğraflı) → düzenle → sil, site ayarı kaydet
  - Not: Keystatic arayüzü İngilizce (Save, Add, Choose file…); alan adları Türkçe
  - ✅ Kontrol: Panelden proje ekle, fotoğraf yükle, düzenle, sil → değişiklik
    sitede görünür.

- [ ] **Aşama 5 — Sayfa tasarımları** (ilk sürüm hazır: 18.10.2026; panel sonrası
  gözden geçirme ve iyileştirme yapılacak)
  - 5a: Ana sayfa (hero, öne çıkan projeler, hizmetler özeti, güven göstergeleri,
    iletişime çağrı)
  - 5b: Projeler listesi (durum filtresi) + proje detay (galeri, özellikler)
  - 5c: Hizmetler, Hakkımızda, İletişim (mailto, sosyal medya)
  - ✅ Kontrol: Her alt aşamada telefon (360px), tablet ve masaüstünde kontrol.

- [ ] **Aşama 6 — SEO, performans ve erişilebilirlik**
  - Başlık/açıklama, Open Graph, `sitemap.xml`, `robots.txt`, 404
  - **Yayın öncesi örnek içerik temizliği:** tüm kurgu metinler, rakamlar
    (ör. "40+ proje"), iletişim bilgileri (`info@example.com`), sosyal medya
    bağlantıları ve temsili görseller gerçekleriyle değiştirilir; `isPlaceholder`
    işaretli proje kalmaz
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
    sağlayıcısında (Netlify / Vercel, ücretsiz planlar) çalıştırılması, panelin
    yalnızca yerelde kullanılması (içerik yerelde düzenlenip push edilir),
    Keystatic Cloud (⚠️ 3 kullanıcıya kadar ücretsiz, fazlası ücretli — onay gerekir).
  - ✅ Kontrol: Test sonuç raporu ve seçilen yöntem için kullanıcı onayı.

- [ ] **Aşama 8 — Deployment**
  - GitHub deposunu barındırmaya bağlama; `main` → otomatik yayın
  - Keystatic GitHub modu (Aşama 7'de doğrulanan yöntemle)
  - Ek güvenlik: `/keystatic` önüne Cloudflare Access (yalnızca sizin e-postanız;
    ücretsiz plan 50 kullanıcı — ⚠️ kayıtta ödeme yöntemi istenirse onay alınır,
    istenmezse veya reddedilirse yalnızca GitHub girişiyle devam edilir)
  - Gizli anahtarlar barındırma ortam değişkenlerinde
  - ✅ Kontrol: Geçici adreste site açılır; panel değişikliği yayına girer; başka
    hesapla panele girilemez.

- [ ] **Aşama 9 — Domain ve HTTPS**
  - Domain seçimi ve satın alma (.com.tr / .com) — ⚠️ **projedeki tek kaçınılmaz ücret**
    (yıllık); satın alma öncesi fiyat karşılaştırması ve onay. Domain alınmazsa site
    ücretsiz `*.pages.dev` adresinde yayında kalabilir
  - DNS yönetimi (Cloudflare), özel domain bağlama
  - HTTPS (otomatik sertifika), `www` ↔ kök yönlendirme, HTTP → HTTPS zorunluluğu
  - Kurumsal e-posta: Cloudflare Email Routing (ücretsiz; info@ → kişisel adrese
    yönlendirme). info@ adresinden e-posta *gönderme* gerekirse ücretsiz seçenekler
    önce denenir; ücretli e-posta servisi (⚠️) yalnızca onayla
  - ✅ Kontrol: `https://alanadi` açılır, sertifika geçerli, info@ e-postası ulaşır.

- [ ] **Aşama 10 — İletişim kanalları**
  - İletişim formu (Cloudflare fonksiyonu + Resend ücretsiz plan: ayda 3.000 / günde 100
    e-posta + Turnstile spam koruması, ücretsiz)
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
- **Fotoğraf boyutu:** panel orijinal dosyayı depoya yazar. Telefondan doğrudan yüklenen
  4–6 MB'lık fotoğraflar depoyu hızla büyütür (GitHub ~1 GB önerir). Yükleme öncesi
  küçültme (≈2000 px, ≈400 KB) ile ~200–300 proje veritabanı olmadan taşınabilir.

## 5. Maliyet (kural: her şey ücretsiz; ⚠️ = onay gerektirir)
Kontrol tarihi: 18.10.2026. Ücretsiz kotalar sağlayıcıya bağlıdır, kullanmadan önce yeniden doğrulanır.

| Kalem | Durum | Not |
|---|---|---|
| Astro, Tailwind, Keystatic, React, TypeScript, sharp | ✅ Ücretsiz | Açık kaynak (MIT / Apache-2.0) |
| Manrope font | ✅ Ücretsiz | OFL-1.1, ticari kullanım serbest |
| Node.js, npm | ✅ Ücretsiz | |
| GitHub private depo | ✅ Ücretsiz | GitHub Free; Actions/LFS kullanılmıyor |
| Cloudflare Pages | ✅ Ücretsiz | 500 derleme/ay, 20.000 dosya, 20 dk derleme süresi |
| Cloudflare DNS, SSL/HTTPS, Email Routing | ✅ Ücretsiz | |
| Cloudflare Turnstile | ✅ Ücretsiz | Form spam koruması |
| Resend (iletişim formu) | ✅ Ücretsiz plan | 3.000 e-posta/ay, 100/gün |
| Cloudflare Access | ✅ Ücretsiz plan | 50 kullanıcı; ⚠️ ödeme yöntemi istenirse onay |
| **Domain (.com.tr / .com)** | ⚠️ **Ücretli (yıllık)** | Tek kaçınılmaz ücret; alternatif: ücretsiz `*.pages.dev` |
| Kurumsal e-posta gönderimi (info@'dan yazma) | ⚠️ Olası ücret | Yönlendirme ücretsiz; gönderme için ücretsiz yollar önce denenir |
| Keystatic Cloud | ⚠️ 3 kullanıcıdan sonra ücretli | Yalnızca Aşama 7 başarısız olursa alternatif |
| Cloudflare R2 (çok fotoğraf olursa) | ⚠️ 10 GB'a kadar ücretsiz | Kurulumda ödeme yöntemi isteyebilir; aşılırsa ücretli |
| Veritabanı (Faz C, emlak ilanları) | ⚠️ Ücretsiz katmanlar var | Cloudflare D1 vb.; kota aşılırsa ücretli |
| Cloudflare Images, ücretli temalar/eklentiler | ❌ Kullanılmayacak | |
