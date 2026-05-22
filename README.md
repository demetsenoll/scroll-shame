# Scroll Shame

Sosyal medya kullanımını takip eden, farkındalık yaratan ve dopamin döngüsünü kırmana yardımcı olan Android uygulaması.

TikTok, Instagram, YouTube ve Twitter'da geçirdiğin süreyi kaydet — uygulama bunu kitap sayfası, koşu kilometresi, Pomodoro döngüsü gibi gerçek hayat karşılıklarına dönüştürür. Ne kaybettiğini görünce durmak kolaylaşır.

---

## Özellikler

- **Shame Score** — Günlük scroll süresine göre 0–100 arası etki puanı
- **Brain Recovery Meter** — Haftalık ortalama + tamamlanan görevlerden hesaplanan toparlanma skoru
- **Touch Grass Görevleri** — XP kazandıran gerçek hayat görevleri (dışarı çık, su iç, şınav çek…)
- **Haftalık Grafik** — Son 7 günün scroll dağılımı ve renk kodlu shame seviyesi
- **Günlük Özet** — Günün anlamlı karşılıklarıyla özetlenmesi
- **Streak Sistemi** — Her gün veri girişi streak'ini sürdürür
- **Günlük Bildirim** — Her akşam 21:00'de hatırlatıcı
- **Profil & Paylaşım** — Haftalık istatistikleri arkadaşlarla paylaş

---

## Ekran Görüntüleri

> `assets/` klasörüne eklenecek

---

## Teknoloji

| Katman | Teknoloji |
|---|---|
| Framework | React Native + Expo SDK 54 |
| Navigasyon | Expo Router (file-based) |
| State | Zustand + AsyncStorage |
| Animasyon | React Native Reanimated v4 |
| UI | expo-linear-gradient, expo-blur |
| Bildirim | expo-notifications |
| Haptic | expo-haptics |
| Native (Android) | UsageStatsManager (local Expo module) |
| Tip sistemi | TypeScript strict mode |

---

## Kurulum

### Gereksinimler

- Node.js 20+
- npm veya yarn
- Android Studio (native build için)
- Expo CLI: `npm install -g expo-cli`

### Adımlar

```bash
# 1. Repoyu klonla
git clone https://github.com/KULLANICI_ADI/scroll-shame.git
cd scroll-shame

# 2. Bağımlılıkları yükle
npm install

# 3. Native klasörü oluştur (ilk kez veya temiz build)
npx expo prebuild --platform android

# 4. Android'de çalıştır
npx expo run:android
```

> **Not:** `expo start` ile Metro başlatabilirsin ama UsageStats özelliği yalnızca gerçek native build'de çalışır (`expo run:android`).

### Geliştirme (hot reload)

```bash
npm start
# veya tünel üzerinden (farklı ağda cihaz):
npx expo start --tunnel --clear
```

---

## Android İzinleri

Bu uygulama iki özel Android izni kullanır:

| İzin | Amaç |
|---|---|
| `PACKAGE_USAGE_STATS` | Hangi uygulamada ne kadar zaman geçirildiğini okur |
| `POST_NOTIFICATIONS` | Günlük hatırlatıcı bildirimi gönderir (Android 13+) |

`PACKAGE_USAGE_STATS` sistem izni olduğu için kullanıcı Ayarlar → Kullanım Erişimi ekranından manuel olarak vermelidir.

---

## Proje Yapısı

```
scroll_shame/
├── app/                    # Expo Router sayfa dosyaları
│   ├── (tabs)/             # Ana sekme ekranları
│   │   ├── index.tsx       # Ana ekran
│   │   ├── stats.tsx       # İstatistikler
│   │   ├── recovery.tsx    # Brain Recovery + görevler
│   │   └── profile.tsx     # Profil
│   ├── add-time/           # Scroll süresi giriş ekranı
│   ├── daily-recap/        # Günlük özet ekranı
│   └── onboarding/         # İlk kurulum akışı
├── components/             # Yeniden kullanılabilir bileşenler
│   ├── home/               # Ana ekran bileşenleri
│   ├── challenges/         # Touch Grass kartları
│   ├── recovery/           # Brain Meter
│   ├── stats/              # Haftalık grafik
│   └── ui/                 # Genel UI (ProgressRing, StatBadge…)
├── store/
│   └── useAppStore.ts      # Zustand global state
├── utils/
│   ├── shameEngine.ts      # Puan hesaplama, mesajlar, dönüşümler
│   └── notifications.ts    # Bildirim planlama
├── modules/
│   └── usage-stats/        # Android UsageStatsManager native modülü
├── plugins/
│   └── withUsageStats.js   # Expo config plugin (manifest izni)
├── constants/
│   └── theme.ts            # Renk paleti, tipografi, spacing
└── types/
    └── index.ts            # TypeScript tip tanımları
```

---

## Hedef Kullanıcı

- **16–28 yaş** arası, sosyal medya kullanımından rahatsız olan gençler
- Dopamin detoksu yapmak isteyenler
- Telefon bağımlılığının farkında olup değiştirmek isteyenler
- Dijital minimalizm pratiği yapmaya çalışanlar

---

## Katkı

Pull request'ler açık. Büyük değişiklikler için önce bir issue aç.

1. Fork'la
2. Feature branch oluştur (`git checkout -b feature/özellik-adı`)
3. Commit at (`git commit -m 'feat: kısa açıklama'`)
4. Push at (`git push origin feature/özellik-adı`)
5. Pull Request aç

---

## Lisans

MIT
