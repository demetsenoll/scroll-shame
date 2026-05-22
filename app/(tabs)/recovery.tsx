import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { BrainMeter } from '../../components/recovery/BrainMeter';
import { useAppStore } from '../../store/useAppStore';
import { GradientCard } from '../../components/ui/GradientCard';

const RECOVERY_TIPS = [
  { icon: '📵', tip: 'Telefonu görünmez bir yere koy.', impact: 'Yüksek' },
  { icon: '🚶', tip: '10 dakika yürü, kulaklıksız.', impact: 'Yüksek' },
  { icon: '📚', tip: 'Fiziksel bir kitap aç.', impact: 'Orta' },
  { icon: '💧', tip: 'Su iç. Gerçekten.', impact: 'Düşük' },
  { icon: '🌬️', tip: '4-7-8 nefes tekniği dene.', impact: 'Orta' },
  { icon: '🛌', tip: 'Yatmadan 1 saat önce ekranı kapat.', impact: 'Çok Yüksek' },
  { icon: '🤝', tip: 'Biriyle yüz yüze konuş.', impact: 'Yüksek' },
  { icon: '✍️', tip: 'El yazısıyla bir şeyler yaz.', impact: 'Orta' },
];

const IMPACT_COLORS: Record<string, string> = {
  'Çok Yüksek': Colors.recovery,
  'Yüksek': '#86EFAC',
  'Orta': Colors.gold,
  'Düşük': Colors.blue,
};

export default function RecoveryScreen() {
  const { brainRecoveryScore, completedChallenges, totalXP, dailyLogs } = useAppStore();
  const hasData = dailyLogs.length > 0 || completedChallenges.length > 0;

  const level = (() => {
    if (!hasData) return { title: 'Yolculuk Başlamadı', tier: 0 };
    if (brainRecoveryScore >= 80) return { title: 'Dopamin Münzevi', tier: 5 };
    if (brainRecoveryScore >= 60) return { title: 'Odak Ustası', tier: 4 };
    if (brainRecoveryScore >= 40) return { title: 'Farkındalık Yolcusu', tier: 3 };
    if (brainRecoveryScore >= 20) return { title: 'Uyanış Başlangıcı', tier: 2 };
    return { title: 'Scroll Bağımlısı', tier: 1 };
  })();

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.title}>Brain Recovery</Text>
            <Text style={styles.sub}>Zihnin iyileşme durumu</Text>
          </View>

          {/* Brain meter */}
          <BrainMeter score={brainRecoveryScore} />
          {!hasData && (
            <View style={styles.noDataNote}>
              <Text style={styles.noDataText}>
                Ana sayfadan scroll süresini girdikten sonra gerçek toparlanma skoru hesaplanacak.
              </Text>
            </View>
          )}

          {/* Level card */}
          <LinearGradient
            colors={['#150a2d', '#0f0f0f']}
            style={styles.levelCard}
          >
            <View style={styles.levelRow}>
              <View style={styles.tierStars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Text
                    key={i}
                    style={{ fontSize: 16, opacity: i < level.tier ? 1 : 0.2 }}
                  >
                    ⭐
                  </Text>
                ))}
              </View>
              <View style={styles.levelInfo}>
                <Text style={styles.levelLabel}>MEVCUT SEVİYE</Text>
                <Text style={styles.levelTitle}>{level.title}</Text>
              </View>
            </View>
            <View style={styles.levelStats}>
              <View style={styles.levelStat}>
                <Text style={styles.levelStatValue}>{completedChallenges.length}</Text>
                <Text style={styles.levelStatLabel}>Görev</Text>
              </View>
              <View style={styles.levelStatDivider} />
              <View style={styles.levelStat}>
                <Text style={styles.levelStatValue}>{totalXP}</Text>
                <Text style={styles.levelStatLabel}>XP</Text>
              </View>
              <View style={styles.levelStatDivider} />
              <View style={styles.levelStat}>
                <Text style={styles.levelStatValue}>{brainRecoveryScore}%</Text>
                <Text style={styles.levelStatLabel}>Toparlanma</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Recovery tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Toparlanma İpuçları</Text>
            <View style={styles.tipsList}>
              {RECOVERY_TIPS.map((tip, i) => (
                <GradientCard
                  key={i}
                  gradient={['#141414', '#111111']}
                  style={styles.tipCard}
                >
                  <Text style={styles.tipIcon}>{tip.icon}</Text>
                  <Text style={styles.tipText}>{tip.tip}</Text>
                  <View
                    style={[
                      styles.impactBadge,
                      {
                        backgroundColor: IMPACT_COLORS[tip.impact] + '20',
                        borderColor: IMPACT_COLORS[tip.impact] + '40',
                      },
                    ]}
                  >
                    <Text style={[styles.impactText, { color: IMPACT_COLORS[tip.impact] }]}>
                      {tip.impact}
                    </Text>
                  </View>
                </GradientCard>
              ))}
            </View>
          </View>

          {/* Dopamine facts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dopamin Gerçekleri</Text>
            <View style={styles.factsContainer}>
              {[
                {
                  emoji: '🧪',
                  fact: 'Her "beğeni" bildirimi beyne küçük bir dopamin vuruşu gönderir — tıpkı slot makinesi gibi.',
                },
                {
                  emoji: '⏱️',
                  fact: "TikTok'un algoritması, izleyiciyi ortalama 90 saniyede bir 'ödüllendirerek' bağımlılık döngüsü kurar.",
                },
                {
                  emoji: '🧠',
                  fact: 'Aşırı scroll, prefrontal korteksi (karar verme merkezi) zayıflatır.',
                },
                {
                  emoji: '🌱',
                  fact: '3 haftalık dijital detoks, dopamin reseptörlerinin büyük kısmını onarabilir.',
                },
              ].map((item, i) => (
                <View key={i} style={styles.factCard}>
                  <Text style={styles.factEmoji}>{item.emoji}</Text>
                  <Text style={styles.factText}>{item.fact}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: Spacing.xxxl }} />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.xl },
  noDataNote: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  noDataText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  header: { paddingTop: Spacing.lg, paddingBottom: Spacing.lg, gap: 4 },
  title: { ...Typography.h1, color: Colors.text, letterSpacing: -1 },
  sub: { ...Typography.body, color: Colors.textMuted },
  levelCard: {
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.purple + '30',
    gap: Spacing.md,
  },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  tierStars: { flexDirection: 'row', gap: 2 },
  levelInfo: { flex: 1, gap: 2 },
  levelLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  levelTitle: { ...Typography.h3, color: Colors.purple },
  levelStats: {
    flexDirection: 'row',
    backgroundColor: Colors.background + '80',
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  levelStat: { flex: 1, alignItems: 'center', gap: 2 },
  levelStatValue: { ...Typography.h3, color: Colors.text },
  levelStatLabel: { ...Typography.caption, color: Colors.textMuted },
  levelStatDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  section: { marginTop: Spacing.xl },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  tipsList: { gap: Spacing.sm },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  tipIcon: { fontSize: 22 },
  tipText: { ...Typography.body, color: Colors.textSecondary, flex: 1 },
  impactBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  impactText: { ...Typography.caption, fontWeight: '700' },
  factsContainer: { gap: Spacing.sm },
  factCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  factEmoji: { fontSize: 22 },
  factText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
});
