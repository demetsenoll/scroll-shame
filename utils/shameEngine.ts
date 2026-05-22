import { Colors } from '../constants/theme';
import type { ShameConversion } from '../types';

// ─── Clean (score 0-30) ──────────────────────────────────────────────────────
const MSG_CLEAN = [
  "Bugün kontrolü elinde tutuyorsun.",
  "Sessizlik de bir tercih.",
  "Dikkatini korudun. Nadir bir şey bu.",
  "Gerçek hayat ekrandan daha derin.",
  "Beynin bu tempoyu seviyor.",
  "Az scroll, çok yaşam.",
  "Zihnin netleşiyor — hissedebiliyorsun.",
  "Bugün algoritmanın dışındasın.",
  "Dikkat kıttır. Sen onu koruyorsun.",
  "Her kurtardığın dakika, sana geri döner.",
  "Farkındalık bir kas gibi — antrenman yapıyorsun.",
  "Telefona değil, hayatına baktın bugün.",
];

// ─── Mild (score 31-55) ──────────────────────────────────────────────────────
const MSG_MILD = [
  "Her scroll bir dakikan.",
  "Zamanın geri gelmiyor.",
  "Dikkatini satıyorsun.",
  "Hayatın orada değil.",
  "Algoritma seni tanıyor. Sen onu değil.",
  "İçerik bitmez, hayatın biter.",
  "Kaydırmak bağımlılık yaratacak şekilde tasarlandı.",
  "Beynin daha fazlasına layık.",
  "Her 'bir dakika daha' bir saate dönüşür.",
  "Telefon seni seçiyor. Sen seçemiyor musun?",
  "Konsantrasyon yavaş yavaş eriyor.",
  "Scrollun sonu yok. Ama zamanının var.",
];

// ─── Warning (score 56-75) ───────────────────────────────────────────────────
const MSG_WARNING = [
  "Dopamin seni tüketiyor.",
  "Gerçek tatmin kayboldu mu?",
  "Odaklanmak zorlaşıyor, değil mi?",
  "Beynin uyarı veriyor.",
  "Sıkılmak yerine scroll — bu bir döngü.",
  "Prefrontal korteksin zarar görüyor.",
  "Her bildirim bir tuzak.",
  "Sanal ödüller gerçek motivasyonu öldürür.",
  "Ne kadar daha kaydıracaksın?",
  "Bu içerikler seni değiştiriyor mu, geliştiriyor mu?",
  "Bir saat scroll = bir saat ömür.",
  "Sessiz olmayı unutuyorsun.",
  "Beyin boşlukta kalınca yaratıcılık başlar. Boşluk vermiyorsun.",
];

// ─── Critical (score 76-100) ─────────────────────────────────────────────────
const MSG_CRITICAL = [
  "Bugün hayatının bir parçasını teslim ettin.",
  "Algoritma kazandı. Bugün.",
  "Beynin sessizliğe muhtaç.",
  "Gerçek hayat arıyor. Cevap vermiyorsun.",
  "Dopamin sistemin zorlanıyor.",
  "Bu hız sürdürülemez.",
  "Ekranın arkasında hayat durmuyor.",
  "Yarın daha iyisini yapabilirsin. Ama yarın ertelemek de var.",
  "Kaç saat daha? Beynin sormaya başladı.",
  "Bağımlılık bu hissettiriyor: sonsuz ama boş.",
  "Her scroll, derin düşüncenin önüne geçiyor.",
  "Kendin olmak için ekrandan uzak zaman gerekiyor.",
  "Şu an kimsin? Scroll yapan biri mi, yoksa daha fazlası mı?",
];

// ─── Time-of-day overlays ────────────────────────────────────────────────────
const MSG_MORNING = [
  "Sabah ekrana bakmak beynini uyandırmaz, uyuşturur.",
  "İlk 30 dakika senin. Ona sahip çık.",
  "Güne scroll ile başlamak tüm günü etkiliyor.",
];

const MSG_NIGHT = [
  "Gece yarısı scroll yapıyorsun. Beynin uyku arıyor.",
  "Uyumadan önce ekran: melatonini bastırıyor.",
  "Bu içerikler rüyalarında bile olmayacak. Bırak.",
];

// ─── Streak messages ─────────────────────────────────────────────────────────
const MSG_STREAK: Record<string, string[]> = {
  early: [
    "İlk adım atıldı. Devam et.",
    "Bir günlük bilinç — çoğundan daha iyi.",
  ],
  building: [
    "Streak devam ediyor. Beynin bunu fark ediyor.",
    "Alışkanlık kuruluyor. Bırakma.",
    "Her gün biraz daha kolay.",
  ],
  strong: [
    "Bu disiplin çoğu insanda yok.",
    "Streak bir haftalık — bu gerçek bir değişim.",
    "Alışkanlık artık senin parçan.",
  ],
};

/**
 * Returns a context-aware message pool filtered by score, time of day, and streak.
 * Used by DailyMessage component for rotation.
 */
export function getContextualMessages(shameScore: number, streak: number): string[] {
  const hour = new Date().getHours();
  let base: string[];

  if (shameScore <= 30) base = MSG_CLEAN;
  else if (shameScore <= 55) base = MSG_MILD;
  else if (shameScore <= 75) base = MSG_WARNING;
  else base = MSG_CRITICAL;

  const pool = [...base];

  if (hour < 10) pool.push(...MSG_MORNING);
  if (hour >= 23 || hour < 4) pool.push(...MSG_NIGHT);

  if (streak >= 7) pool.push(...MSG_STREAK.strong);
  else if (streak >= 3) pool.push(...MSG_STREAK.building);
  else if (streak >= 1) pool.push(...MSG_STREAK.early);

  return pool;
}


export function convertScrollTime(totalMinutes: number): ShameConversion[] {
  if (totalMinutes === 0) return [];

  const all: (ShameConversion | null)[] = [
    {
      icon: '📚',
      label: 'Kitap sayfası',
      value: `${Math.round(totalMinutes * 0.35)} sayfa`,
      color: Colors.primary,
    },
    {
      icon: '🏃',
      label: 'Koşu',
      value: `${(totalMinutes * 0.12).toFixed(1)} km`,
      color: Colors.orange,
    },
    totalMinutes >= 25 ? {
      icon: '🎯',
      label: 'Pomodoro döngüsü',
      value: `${Math.floor(totalMinutes / 25)} döngü`,
      color: Colors.purple,
    } : null,
    totalMinutes >= 10 ? {
      icon: '🌍',
      label: 'Dil dersi',
      value: `${Math.floor(totalMinutes / 10)} ders`,
      color: Colors.blue,
    } : null,
    {
      icon: '💪',
      label: 'Egzersiz',
      value: totalMinutes >= 45 ? `${Math.floor(totalMinutes / 45)} antrenman` : `${totalMinutes} dk hareket`,
      color: Colors.recovery,
    },
    {
      icon: '👣',
      label: 'Adım sayısı',
      value: `${(totalMinutes * 70).toLocaleString('tr-TR')} adım`,
      color: Colors.gold,
    },
    totalMinutes >= 20 ? {
      icon: '💻',
      label: 'Yazılım pratiği',
      value: `${Math.floor(totalMinutes / 20)} alıştırma`,
      color: Colors.primary,
    } : null,
    {
      icon: '🧘',
      label: 'Meditasyon',
      value: `${totalMinutes} dakika`,
      color: Colors.recoveryDark,
    },
  ];

  return all.filter((item): item is ShameConversion => item !== null);
}

export function getShameLabel(score: number): { label: string; emoji: string; color: string } {
  if (score <= 15) return { label: 'Temiz', emoji: '✨', color: Colors.recovery };
  if (score <= 30) return { label: 'Hafif', emoji: '🟡', color: Colors.gold };
  if (score <= 50) return { label: 'Dikkat Et', emoji: '🟠', color: Colors.orange };
  if (score <= 70) return { label: 'Tehlikeli', emoji: '🔴', color: Colors.primary };
  if (score <= 90) return { label: 'Kritik', emoji: '💀', color: Colors.primaryDark };
  return { label: 'Dopamin Cehennemi', emoji: '☠️', color: '#8B0000' };
}

export function getDopamineLevel(score: number): {
  level: string;
  description: string;
  color: string;
} {
  if (score <= 20) {
    return { level: 'Dengeli', description: 'Beynin sağlıklı durumda', color: Colors.recovery };
  }
  if (score <= 40) {
    return { level: 'Hafif Yüksek', description: 'Dikkatini koruyabilirsin', color: Colors.gold };
  }
  if (score <= 60) {
    return { level: 'Yüksek', description: 'Odaklanmak zorlaşıyor', color: Colors.orange };
  }
  if (score <= 80) {
    return { level: 'Aşırı Yüksek', description: 'Gerçek tatmin kayboldu', color: Colors.primary };
  }
  return { level: 'Tehlike Bölgesi', description: 'Dopamin sistemi zorlanıyor', color: '#FF0000' };
}

const RECAP_LINES_LOW = [
  (m: number) => `Bugün ${m} dakika scroll yaptın.`,
  (_: number) => 'Beynin bugün nefes aldı.',
  (_: number) => 'Gelecekteki sen teşekkür ediyor.',
  (_: number) => 'Dikkatini korudun. Bu nadir.',
  (_: number) => 'Kontrolü elinde tutmak bir beceri.',
];

const RECAP_LINES_MID = [
  (m: number) => `Bugün hayatının ${m} dakikasını teslim ettin.`,
  (m: number) => `${Math.round(m * 0.35)} sayfa kitap okuyabilirdin.`,
  (_: number) => 'Telefonuna çok güvendin bugün.',
  (m: number) => `${(m * 0.12).toFixed(1)} km koşabilirdin bu sürede.`,
  (_: number) => 'Yarın biraz daha az. Sadece biraz.',
  (m: number) => `${Math.floor(m / 25)} pomodoro oturumu yapabilirdin.`,
];

const RECAP_LINES_HIGH = [
  (m: number) => `Bugün hayatının ${(m / 60).toFixed(1)} saatini teslim ettin.`,
  (_: number) => 'Gelecekteki sen bunu fark etti.',
  (_: number) => 'Beynin biraz sessizliği hak ediyor.',
  (m: number) => `${Math.round(m * 0.35)} sayfa kitap okuyabilirdin.`,
  (_: number) => 'Algoritma bugün kazandı. Yarın senin.',
  (m: number) => `${Math.floor(m / 25)} pomodoro oturumu yapabilirdin.`,
  (m: number) => `${(m * 0.12).toFixed(1)} km koşabilirdin bu sürede.`,
];

export function getRecapMessage(totalMinutes: number): string[] {
  // Pick random lines from the appropriate bucket so each recap feels different
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  if (totalMinutes < 30) {
    const lines = shuffle(RECAP_LINES_LOW).slice(0, 3);
    return lines.map((fn) => fn(totalMinutes));
  }

  if (totalMinutes < 90) {
    const lines = shuffle(RECAP_LINES_MID).slice(0, 3);
    return lines.map((fn) => fn(totalMinutes));
  }

  const lines = shuffle(RECAP_LINES_HIGH).slice(0, 4);
  return lines.map((fn) => fn(totalMinutes));
}

export function getWeeklyInsight(logs: { total: number }[]): string {
  if (logs.length === 0) return 'Henüz veri yok.';
  const avg = Math.round(logs.reduce((s, l) => s + l.total, 0) / logs.length);
  const weekly = logs.reduce((s, l) => s + l.total, 0);
  const weeklyHours = (weekly / 60).toFixed(1);

  if (weekly < 30) {
    return `Bu hafta toplam ${weekly} dakika scroll yaptın. Harika bir başlangıç.`;
  }

  const insights = [
    `Bu hafta toplam ${weeklyHours} saat, günde ortalama ${avg} dakika scroll yaptın.`,
    `Günde ${avg} dakika scroll: haftada ${weeklyHours} saat.`,
    `Bu haftanın ${weeklyHours} saati geri gelmiyor.`,
    `Haftada ${weeklyHours} saat: bu süre ne için kullanılabilirdi?`,
  ];

  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return insights[week % insights.length];
}
