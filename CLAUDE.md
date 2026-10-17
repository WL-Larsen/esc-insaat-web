# ESC İnşaat — Kurumsal Web Sitesi

İnşaat firması için kurumsal tanıtım sitesi. Amaç: güven oluşturmak, tamamlanan ve
devam eden projeleri sergilemek. Hedef kitle: konut, arsa ve tadilat ile ilgilenen
bireysel alıcılar. Detaylı yol haritası ve aşamalar: PLAN.md

## Teknoloji
- Astro (statik site) + TypeScript
- Tailwind CSS (v4, Vite eklentisi)
- Keystatic (dosya tabanlı yönetim paneli; şu an `local` modu)
- Node.js 24 LTS (Astro 7 için ≥ 22.22 gerekli), npm
- Yol takma adı: `@/` → `src/`
- Barındırma (ileride, doğrulanacak): Cloudflare Pages

## Komutlar
- `npm run dev` → site: http://localhost:4321, panel: http://localhost:4321/keystatic
- `npm run build` → tip kontrolü (`astro check`) + üretim derlemesi (`dist/`)
- `npm run check` → yalnızca tip kontrolü
- `npm run preview` → derlenmiş siteyi yerelde önizleme

## Klasör yapısı
- `src/pages/` — rotalar (Türkçe URL'ler: /hakkimizda, /projeler, /hizmetler, /iletisim)
- `src/layouts/`, `src/components/` — arayüz
- `src/content/` — panelin yazdığı içerik dosyaları (elle düzenlemeden önce sor)
- `src/assets/` — görseller: `brand/` (logo), `placeholders/` (temsili), panel yüklemeleri
- `src/lib/data/` — **veri erişim katmanı** (tek veri kaynağı arayüzü)
- `src/config/` — `content.ts` (kategori, durum, ikon listeleri), `navigation.ts` (menü)
- `src/i18n/` — arayüz metinleri (`tr.ts`)
- `src/styles/global.css` — marka tokenları (renk, font, radius)
- `keystatic.config.ts` — panel şeması (yalnızca `astro dev` sırasında yüklenir)
- `src/content.config.ts` — içerik koleksiyonları ve doğrulama şeması

## Panel ↔ şema uyumu
- `keystatic.config.ts` ve `src/content.config.ts` alanları birebir eşleşmeli; birini
  değiştirirken diğerini de güncelle.
- Proje görselleri `src/assets/projects/<slug>/` altında; YAML'da
  `../../assets/projects/<slug>/<dosya>` olarak tutulur (Keystatic bu öneki bekler).
- Panel boş alanları `null` yazabilir veya tamamen silebilir → isteğe bağlı metinler
  `optionalText` ile tanımlanır. Yıl alanı panelde metindir, şemada sayıya çevrilir.

## Mimari kurallar
1. **Sayfalar ve bileşenler içeriği yalnızca `src/lib/data/` fonksiyonlarıyla alır**
   (`getProjects()`, `getProjectBySlug()` vb.). `getCollection` sayfalarda doğrudan
   kullanılmaz. Amaç: ileride veritabanına geçişte etkiyi en aza indirmek.
2. **Marka renkleri ve fontlar yalnızca `global.css` tokenlarında** tanımlanır.
   Bileşenlerde sabit renk kodu (#hex) kullanılmaz. Logo yalnızca `Logo.astro` içindedir.
3. **Arayüz metinleri `src/i18n/tr.ts` içinde** tutulur, bileşenlere gömülmez
   (ileride EN/RU için).
4. **Kategoriler ve durumlar `src/config/` içinde tek yerde** tanımlanır; panel şeması
   ve içerik doğrulaması aynı listeyi kullanır.
5. **Mobil öncelikli (en önemli öncelik):** önce mobil stiller, sonra `md:` / `lg:`.
   Her bileşen 360px genişlikte kontrol edilir.
6. **Görsel kalite müşteri sitesine ayrılır.** Panel Keystatic'in varsayılan arayüzüyle
   sade kalır; panele özel tasarım/özelleştirme yapılmaz.
7. **Temsili görseller** gerçek proje izlenimi vermez; nötr/soyut olur ve
   "Temsili görsel" etiketi taşır (`isPlaceholder` alanı). Örnek içerik kurgudur;
   gerçek firma/proje/kişi adı kullanılmaz, iletişim bilgileri geçersiz tutulur.
8. Görsel kontrol: headless Edge en az 504px genişlik açar; 390px mobil görünüm için
   sayfa 390px'lik bir iframe içinde görüntülenir.
9. Görseller her zaman Astro `<Image>` / `<Picture>` ile kullanılır.
10. Erişilebilirlik: anlamlı `alt` metinleri, klavye ile gezinme, yeterli kontrast.

## Çalışma kuralları
- Kullanıcıya **Türkçe** yanıt ver. Kod, değişken ve dosya adları İngilizce;
  kullanıcıya görünen metinler ve URL'ler Türkçe.
- Onay almadan dosya oluşturma, kod yazma veya önemli değişiklik yapma.
- Mevcut kodu okumadan değiştirme.
- **Yeni bağımlılık eklemeden önce onay al** ve gerekçesini belirt.
- Gereksiz dosya, soyutlama ve kod üretme; token tüketimini verimli kullan.
- PLAN.md'deki aşamalara sadık kal. Her aşama sonunda: ne yapıldığını ve kullanıcının
  nasıl test edeceğini kısaca açıkla. Tamamlanan aşamanın kutucuğunu işaretle.
- Commit mesajları Türkçe ve kısa: `aşama-N: <ne yapıldı>`.
- **GitHub'da depo oluşturma, push ve deployment işlemlerinden önce onay al.**
- `.env` ve gizli anahtarlar asla commit edilmez.
