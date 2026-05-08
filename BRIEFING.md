# Mahrem-İz — Site Briefing

> *"Mutluluğu Sergileme, Huzuru Yaşa."*
> Sosyalfest 2026 · Dijital Mahremiyet & Aile Etiği Projesi
> Faz 1 + Faz 2 + Faz 3 tamamlandı · Son güncelleme: 2026-05-08

---

## 1. Proje Kimliği

| Alan | Değer |
|---|---|
| **Slogan** | Mutluluğu Sergileme, Huzuru Yaşa. |
| **Logo** | `Mahrem` (beyaz/lacivert) + `-İz` (altın aksan) |
| **Domain** | mahremiz.com.tr (canonical) · canlı: `hamza98-ops.github.io/mahrem-iz` |
| **Etkinlik** | Sosyalfest 2026 |
| **Proje sahipleri** | **Hatice Aydar · Tuğba Çalışkan · Emira Ay** |
| **Akademik danışman** | **Hamza Özen** |
| **Hedef kitle** | (1) Türkiye'deki Müslüman aileler, (2) İlahiyat/dijital etik öğrencileri, (3) Sosyalfest jürisi, (4) İçerik üreticileri |
| **Dil** | Türkçe (lang="tr") |
| **Repo** | github.com/hamza98-ops/mahrem-iz |
| **Deploy** | GitHub Pages, `main` branch root'undan otomatik (~45-90 sn build) |

### Misyon
Sosyal medya ve influencer ebeveynlik fenomenini klasik fıkıh perspektifinden değerlendiren; aileler için **3 davranış-değiştirici interaktif araç**, **4 akademik alt sayfa**, **birincil anket** ve **etik içerik üretici manifesti** sunan bir farkındalık projesi. Yasak değil, **bilinçli seçim** vurgular.

### Üç temel iddia
1. **Aileler emanettir, sergi nesnesi değildir.** Velâyet bir mülk değil emanettir (Râgıb el-Isfahânî).
2. **Mahremiyet bir kale, bir yasak değildir.** İçinde sıcaklığın korunduğu alan (setr).
3. **Her paylaşım bir seçim, her takip bir oydur.** Dikkatiniz nereye giderse, orayı büyütürsünüz.

---

## 2. Teknik Stack

### Mimari
- **Tek sayfa + 8 alt sayfa** statik site — SPA değil, geleneksel anchor + multi-page
- 14+ dosya: `index.html` (~2150 satır), `styles.css` (~3500 satır), `script.js` (~870 satır)
- 8 alt HTML: 4 akademi + anket.html + araclar.html + sosyalfest.html + kvkk.html
- 35+ webp görsel + 3 PDF + 1 CSV
- **Sıfır 3rd-party tracker** · sıfır framework · sıfır build adımı
- `defer` JS, CSS preconnect, lazy-loaded görseller

### Tarayıcı API'leri (vanilla)
- `IntersectionObserver` — sinematik 11 sahne + AOS animasyon
- `<dialog>` — paylaşım kartı modali
- `popover="auto"` — fıkıh sözlüğü (HTML5 native)
- Canvas API — Etik Karne paylaşım kartı (story 1080×1920 + kare 1080×1080)
- `localStorage` — 7 Günlük Temizlik durumu
- `navigator.share` + `clipboard.writeText`
- Tek harici kaynak: Google Fonts (Playfair Display + Inter)

---

## 3. Tasarım Sistemi

### Renk Paleti

| CSS değişken | Hex | Kullanım |
|---|---|---|
| `--navy` / `--navy-deep` | `#0f1f3d` / `#07132a` | Birincil koyu yüzey |
| `--teal` / `--teal-light` | `#1a5276` / `#2e86ab` | Aksan |
| `--gold` / `--gold-light` | `#c9a84c` / `#e8c76a` | Vurgu (dekoratif) |
| `--gold-text` | `#8c6b1f` | **Normal text — WCAG AA 4.63:1** |
| `--cream` / `--cream-dark` | `#faf7f0` / `#f0ebe0` | Açık zeminler |
| `--green` / `--yellow` / `--red` | `#27ae60` / `#f39c12` / `#e74c3c` | Trafik ışığı |

### Tipografi
- **Başlık:** Playfair Display (serif, italic'ler altın `<em>`)
- **Gövde:** Inter (sans-serif, 16px / line-height 1.7)

### Erişilebilirlik
- WCAG AA kontrast (`--gold-text` ile)
- ARIA tam (role, aria-selected, aria-controls, aria-live, aria-expanded, role="progressbar")
- `prefers-reduced-motion` global blok — animasyon/transition susturulur
- Klavye desteği (ESC, ←→, Tab)
- `<fieldset>` + `<legend>` her radio grubu için

---

## 4. Sayfa Mimarisi (Yeni Akış — Faz 3 Reorganizasyonu Sonrası)

```
┌─ NAVBAR (sticky) ─────────────────────────────────┐
│  Başla · Araçlar · Rehber · Akademi · Belgeler   │
│  · Hakkımızda · [Paylaşım Testi pill]            │
└──────────────────────────────────────────────────┘
   ↓
01. HERO  →  "Aileniz Bir Emanettir."
            CTA: Paylaşmadan Önce Test Et / Etik Karne / Aile Sözleşmesi

═══ 3 ARAÇ PAKETİ (yan yana, hızlı erişim) ═══
02. PAYLAŞMADAN ÖNCE 10 SANİYE TESTİ — amiral araç
    7 soru · yes/no · kırmızı çizgi mantığı · 4-renkli sonuç
03. ETİK KARNE — 7 kriter ağırlıklı 100p · paylaşılabilir Canvas kartı
04. 7 GÜNLÜK TAKİP LİSTESİ TEMİZLİĞİ — kampanya · localStorage

═══ PROBLEM TANIMI (kanıt + tanı) ═══
05. İSTATİSTİKLER — dış kaynak (Nominet/AVG/IWF, %73·1300+·%68)
06. TOPLUMSAL AYNA — ANKET — 96 katılımcı, kendi birincil verimiz
    9.19/10 · %82 nazar · %71 kuralı yok · %85 ilgi
07. ÜÇLÜ VİZYON — Teolojik · Sosyolojik · Çözüm

═══ MEDYA (duygusal motiv) ═══
08. ŞARKI — Derd-i Nihân (sesli manifesto, YT facade)
09. TANITIM FİLMİ 1 — Çocuk Emanet mi, Ticari Meta mı?
10. TANITIM FİLMİ 2 + DEEPFAKE — Kadim Fıkıh ve Deepfake +
    Sed-i Zerâî infografiği + Görüntüm Kötüye Kullanıldıysa
    7 adımlık kriz rehberi

═══ AKADEMİK DERİNLİK ═══
11. AKADEMİ — 4 kart özet → 4 alt sayfa (3-katmanlı: 1dk → 12-15dk → PDF)
12. FIKHÎ DENETİM — sinematik 11 sahne + 3 PDF (51 sayfa toplam)

═══ PRATİK ═══
13. EBEVEYN REHBERİ — Aile Sözleşmesi (7 madde, imza, yazdır) +
    Yaşa göre rehber accordion (0-6, 7-12, 13-18)

═══ ÇAĞRI + YENİ KİTLE ═══
14. MANİFESTO — kendi section (Faz 3'te Rehber'den çıkarıldı)
15. İÇERİK ÜRETİCİ 8 İLKESİ — yeni hedef kitle, etik manifest

═══ KİMLİK + İLETİŞİM ═══
16. HAKKIMIZDA — 4 değer kartı + Güven Katmanı (5 madde + ekip listesi)
17. İLETİŞİM — Form (KVKK aydınlatma + çocuk uyarı) + e-posta
18. KAYNAKÇA — istatistik + İslam + akademik kaynaklar
+   FOOTER — 17 link + 11 popover Fıkıh Sözlüğü
```

---

## 5. Alt Sayfalar (8 adet)

| Sayfa | Konu | Yazılım |
|---|---|---|
| `akademi/fikih.html` | Modern Fıkıh ve Dijital Mahrem (~15 dk) | Zeynep Selin · Uğur Kuru · Hüseyin D. fişlerinden |
| `akademi/sharenting.html` | Çocuk İçeriği & Velâyetin Sınırı (~14 dk) | Gülenda · Numan Ünver fişlerinden |
| `akademi/nazar.html` | Nazar ve Algoritma · Hıfz-ı Akl (~12 dk) | Raşit Akpınar fişinden |
| `akademi/deepfake.html` | Deepfake ve Sûret Mahremiyeti (~13 dk) | Mustafa Özgür 2 fişinden |
| `anket.html` | Anket detay raporu, 8 başlık, CSS bar charts | 96 katılımcı, 19 soru |
| `araclar.html` | 3 aracı tek yerde toplayan hub sayfası | — |
| `sosyalfest.html` | 8 başlıklı standalone proje dosyası (jüri için) | — |
| `kvkk.html` | KVKK 6698 aydınlatma metni, 9 başlık | — |

Her alt sayfada `.doc-header` (mobil-dostu sade nav, sticky değil) + footer + canonical + OG meta + JSON-LD.

---

## 6. Üç İnteraktif Araç (Davranış-Değiştirici)

### 6.1 Paylaşmadan Önce 10 Saniye Testi (#paylasim-testi)
- **Soru:** *"Bu paylaşımı yapmalı mıyım?"*
- 7 soru · yes/no segmented kontrol
- **Kırmızı çizgi:** Soru 3 (mahrem hâl) ve 7 (kendi rahatsızlığınız) → otomatik kırmızı
- Skor: 0-1 yeşil · 2-3 sarı · 4-5 turuncu · 6-7 kırmızı
- Sonuç: trafik ışığı + sözlü hüküm + somut eylem önerisi (düzenle/ertele/kapalı çevre)

### 6.2 Etik Karne (#karne)
- **Soru:** *"Bu hesabı takip etmeli miyim?"*
- 7 kriter · 1-5 yıldız · ağırlıklı toplam 100 puan
- Ağırlıklar: Çocuk mahremiyeti %30 (kırmızı çizgi) · Aile araçsallaştırma %20 (kırmızı çizgi) · Reklam şeffaflığı %15 · Kıyas %10 · Bağımlılık %10 · Din %10 · Kriz %5
- **Kırmızı çizgi:** Kriter 1 veya 3'e 1 yıldız → otomatik kırmızı
- Canvas paylaşım kartı (Story 1080×1920 / Kare 1080×1080)
- Native Web Share API + PNG indirme

### 6.3 7 Günlük Takip Listesi Temizliği (#temizlik-7gun)
- **Soru:** *"Algoritmamı yeniden nasıl eğitirim?"*
- 7 günlük görev kartı (responsive grid)
- Custom checkbox + 3 alt adım her görev için
- localStorage durum (`mahrem-iz.temizlik-7gun.v1`) — sunucusuz
- 7/7 tamamlanınca navy gradient finale kutusu

**Tutarlılık:** Üç araç da privacy-first — verileriniz sunucuya gitmez, çerez kurulmaz.

---

## 7. Akademi 3-Katmanlı Model

```
Ana sayfa kart (1 dk özet · 4 kart) →
  Alt sayfa (12-15 dk akademik yazı · klasik fıkıh kaynaklı) →
    Tam PDF (varsa)
```

Akademik fişler ekipten değil **dış kaynak** (Sosyal Medya İlmihali çalışmasından): 13 fiş yazarı kaynaklarda atfedilir, ekipte sayılmaz.

---

## 8. Anket — Toplumsal Ayna (Birincil Veri)

**Saha:** Mart-Mayıs 2026, çevrimiçi · 96 yanıt · 19 soru

**4 Anahtar Bulgu (ana sayfa):**
- **9.19/10** mahremiyet önem skoru (76 kişi 10 verdi)
- **%82** nazar endişesi (her zaman %51 + bazen %31)
- **%71** aile içi yazılı/sözlü kuralı YOK (sadece %29 var)
- **%85** bilgilendirici çalışmaya katılım isteği

**Detay:** [anket.html](anket.html) — 8 başlık, CSS bar charts, 4 anonim alıntı, ham CSV indirme.

**Türkiye'ye özgü birincil veri** — Nominet/AVG/IWF dış istatistiklerin yerel paraleli.

---

## 9. İçerik Üretici 8 İlkesi (#ilkeler)

İnfluencer/yayıncılara yönelik etik manifest:

1. Çocuğu reklam yüzü yapma (Kâsânî · velâyet-i nazar zarar)
2. Yüz ve günlük rutini sürekli gösterme (dijital ayak izi)
3. **Mahrem anları paylaşma** *(kırmızı vurgu)* (setr · Ebû Hanîfe 'kabîh')
4. Okul / konum / ev içi gizle (operasyonel sınır)
5. Sponsorluğu açıkça belirt (Hakîm b. Hizâm · ğiş yasağı)
6. **Çocuğun "hayır" deme hakkını tanı** *(kırmızı vurgu)* (emanet)
7. Eski içerikleri düzenli gözden geçir (yıllık arşiv tarama)
8. Takipçi ilgisini çocuğun mahremiyetinden üstün tutma

**Pledge:** İçerik üreticiler biyografilerine *"Mahrem-İz Yayın İlkelerini gözetiyorum"* cümlesini ekleyebilir. Sertifika değil — etik söz.

---

## 10. Gizlilik Mimarisi (Privacy-First)

- **Sıfır 3rd-party tracker** — Google Analytics yok, çerez yok
- **YouTube facade:** 3 video, tıklamadan önce YT'ye istek gitmez. Tıklandığında youtube-nocookie.com (gelişmiş gizlilik) yüklenir.
- **Lokal görsel servis:** YT thumbnail bile lokal webp olarak servis edilir
- **localStorage** (Etik Karne / 7Gün Temizlik durumu) — sunucu yok
- **Form mimarisi:** KVKK 6698 m.5/2-c/f kapsamında aydınlatma; iç içe "kabul ediyorum" kutusu yok (KVKK 2026 rehberi)
- **Çocuk uyarı kutusu** form üzerinde
- **Tek harici kaynak:** Google Fonts (gelecekte lokal host edilebilir)
- **Aydınlatma metni:** [kvkk.html](kvkk.html) — 9 başlık, KVKK m.11 hakları + ALO 183 + KPK referansları

---

## 11. Fıkıh Sözlüğü (HTML5 Popover · 11 Terim)

Emanet · Velâyet · Maslahat · İcâre · Setr · Kabîh · Hürmet-i Hânegî · Müdâhale-i Hürmet · Makâsıd-ı Şerîa · Raiyye

Tap, ESC veya dış tıkla kapanır. Sıfır JS, sıfır kütüphane.

---

## 12. SEO & Sosyal

- `<title>`, `<description>`, `<keywords>` tüm sayfalarda
- **og:image** — 1200×630 marka kartı (`assets/og/mahrem-iz-og.jpg`, ffmpeg ile üretildi)
- **JSON-LD EducationalOrganization** — name, slogan, knowsAbout (8 konu), Sosyalfest 2026 event
- Canonical, OG, Twitter Card, og:locale=tr_TR tüm alt sayfalarda

OG önizleme: [opengraph.xyz/url/...](https://www.opengraph.xyz/url/https%3A%2F%2Fhamza98-ops.github.io%2Fmahrem-iz%2F)

---

## 13. Faz Tarihçesi

### Faz 1 — Hijyen ve Dürüstlük (8/8 tamamlandı)
1. Altın metin kontrastı (WCAG AA 4.63:1)
2. YouTube facade gizlilik metni dürüstleştirme
3. `prefers-reduced-motion` global blok
4. PDF kartları metadata + 3 madde özet
5. İstatistik örneklem + Akademi/Fıkhî fetva notu
6. OG image + meta + JSON-LD EducationalOrganization
7. Navbar 9→6 + Hero CTA yeniden mimarisi
8. KVKK aydınlatma + açık rıza ayrıştırması (kvkk.html)

### Faz 2 — Davranışa Bağlama (4/4 tamamlandı)
1. Paylaşmadan Önce 10 Saniye Testi (yeni amiral araç)
2. Etik Karne ağırlıklandırma + kırmızı çizgi
3. Deepfake kriz rehberi (7 adım)
4. 7 Günlük Takip Listesi Temizliği

### Faz 3 — Kurumsallaştırma (6/6 tamamlandı)
1. /sosyalfest.html proje dosyası + Hakkımızda Güven Katmanı
2. /araclar.html hub sayfası (3 araç tek yerde)
3. Akademi 3-katmanlı model (4 alt sayfa, gerçek fişlerden derleme)
4. Anket entegrasyonu (Toplumsal Ayna + /anket.html)
5. İçerik Üretici 8 İlkesi (yeni kitle)
6. Sayfa akışı reorganizasyonu (3 hareket: manifesto extraction + araç paketi + medya konum)

---

## 14. Asset Dökümü

```
assets/
├── cinema/
│   ├── fiqh_01..15.webp        (sinematik 11 sahne)
│   ├── shield_01..18.webp       (proje sunum kapakları)
│   ├── infografik.webp           (Beş Temel İlke)
│   ├── deepfake-terazi-infografik.webp  (Sed-i Zerâî)
│   ├── derd-i-nihan-cover.webp  (şarkı kapağı)
│   ├── tanitim-thumb.webp        (Tanıtım 1)
│   └── tanitim-2-thumb.webp     (Tanıtım 2)
└── og/
    └── mahrem-iz-og.jpg          (1200×630 sosyal paylaşım)

PDF (kök):
├── mahrem-iz-fikhi-denetim.pdf       (15 sayfa, ~9.4 MB)
├── mahrem-iz-dijital-kalkan.pdf      (18 sayfa, ~9.9 MB)
└── Deepfake_Jurisprudence.pdf        (18 sayfa, ~11.1 MB)

Veri (kök):
└── Dijital Aile Mahremiyeti Farkındalık Anketi (Yanıtlar) - Form Yanıtları 1.csv
   (96 yanıt × 19 soru, ~45 KB)
```

---

## 15. Akademik Fiş Kaynakları (Dış)

Akademi alt sayfaları "Sosyal Medya İlmihali" çalışmasından dış kaynak fişlere dayanır:

| Kullanılan | Yazar | Sayfa |
|---|---|---|
| ✓ | Gülenda — *Çocuk İçeriği, Influencer Ebeveynlik ve Velâyet* | sharenting.html |
| ✓ | Numan Ünver — *Velâyetin Sınırı: Dijital Ayak İzi Fıkhı* | sharenting.html |
| ✓ | Mustafa Özgür — *Deepfake Analizi* + *Yapay Zekâ Çağında Yalan ve Sorumluluk* | deepfake.html |
| ✓ | Raşit Akpınar — *Sosyal Medya Bağımlılığı: Dârar ve Hıfz-ı Akl* | nazar.html |
| ✓ | Zeynep Selin Hoca — *Dijital Halvet Fıkhı* | fikih.html |
| ✓ | Uğur Kuru — *Eşler Arası Özel Hayat Paylaşımı Fıkhı* | fikih.html |
| ✓ | Hüseyin D. — *Dijital Arşiv, Setr-i Uyûb ve Tövbe* | fikih.html |
| ⏳ | Bahattin Karakuş — İnternet Satış Fıkhî Analizi | (Faz 4 — kütüphane) |
| ⏳ | Esra Dürdane — Dijital Mesajla Kinâye Talâk | (Faz 4 — kütüphane) |
| ⏳ | Fatih Kirenci — Dijital Canlı Zekât Sadaka | (Faz 4 — kütüphane) |
| ⏳ | Nilüfer Hoca — Dijital Delil ve Şahitlik Fıkhı | (Faz 4 — kütüphane) |
| ⏳ | Raşit Akpınar — Bot/Sahte Takipçi/Haksız Kazanç | (Faz 4 — kütüphane) |
| ⏳ | Şeyma Yeşilyayla — Chatbot ile Yanlış Yönlendirme + AI Sorumluluğu | (Faz 4 — kütüphane) |
| ⏳ | Yasin Yıldız — Haber Teyidi Fıkhı | (Faz 4 — kütüphane) |

Bu yazarlar **proje ekibi değildir**; çalışmaları akademik kaynak olarak atfedilir. Mahrem-İz ekibi: Hatice Aydar, Tuğba Çalışkan, Emira Ay (proje sahipleri) + Hamza Özen (akademik danışman).

---

## 16. Olası Geliştirme Kapıları (Faz 4)

- **Akademi kütüphanesi genişletme:** kalan 7 fiş için ayrı alt sayfalar + /akademi/index.html kütüphane
- **Çerezsiz olay ölçümü:** GoatCounter aktivasyonu + custom event hooks (karne_completed, paylasim_red, temizlik_day_X, pdf_downloaded)
- **Çoklu dil:** EN/AR
- **Lighthouse a11y audit + INP/LCP optimizasyon**
- **Google Fonts lokal host** (gizlilik tutarlılığı için)
- **PDF özetleri:** her PDF için 1 sayfalık özet
- **Sosyal etki dashboard:** anket ve araç kullanım metrikleri (mahremiyet-uyumlu)

---

*Briefing güncellenme tarihi: 2026-05-08 · Faz 3 tamamlanması sonrası · Hazırlayan: Mahrem-İz teknik dokümantasyon ekibi*
