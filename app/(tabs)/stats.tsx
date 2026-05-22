import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { useAppStore } from '../../store/useAppStore';
import { getShameLabel, getWeeklyInsight } from '../../utils/shameEngine';
import { WeeklyBarChart } from '../../components/stats/WeeklyBarChart';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { GradientCard } from '../../components/ui/GradientCard';

export default function StatsScreen() {
  const { dailyLogs } = useAppStore();
  const logs = dailyLogs;

  const avgScore = logs.length > 0
    ? Math.round(logs.slice(-7).reduce((s, l) => s + l.shameScore, 0) / Math.min(logs.length, 7))
    : 0;
  const avgMinutes = logs.length > 0
    ? Math.round(logs.slice(-7).reduce((s, l) => s + l.total, 0) / Math.min(logs.length, 7))
    : 0;
  const weekTotal = logs.slice(-7).reduce((s, l) => s + l.total, 0);
  const weeklyHours = (weekTotal / 60).toFixed(1);
  const shameInfo = getShameLabel(avgScore);
  const insight = getWeeklyInsight(logs.slice(-7));

  const mostUsed = (() => {
    const totals = { TikTok: 0, Instagram: 0, YouTube: 0, Twitter: 0 };
    logs.slice(-7).forEach((l) => {
      totals.TikTok += l.tiktok;
      totals.Instagram += l.instagram;
      totals.YouTube += l.youtube;
      totals.Twitter += l.twitter;
    });
    const entries = Object.entries(totals);
    entries.sort((a, b) => b[1] - a[1]);
    return entries;
  })();

  const topApp = mostUsed[0];
  const totalAppMinutes = mostUsed.reduce((s, [, v]) => s + v, 0);

  const APP_COLORS: Record<string, string> = {
    TikTok: '#FF0050',
    Instagram: '#E1306C',
    YouTube: '#FF0000',
    Twitter: '#1DA1F2',
  };
  const APP_ICONS: Record<string, string> = {
    TikTok: '🎵',
    Instagram: '📷',
    YouTube: '▶️',
    Twitter: '𝕏',
  };

  if (logs.length === 0) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center', gap: 12 }]}>
        <Text style={{ fontSize: 48 }}>📊</Text>
        <Text style={{ ...Typography.h3, color: Colors.text }}>Henüz veri yok</Text>
        <Text style={{ ...Typography.body, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: 32 }}>
          Ana sayfadan scroll süresini ekle, grafikler burada görünecek.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.title}>İstatistikler</Text>
            <Text style={styles.sub}>Son 7 gün analizi</Text>
          </View>

          {/* Weekly insight */}
          <LinearGradient
            colors={['#2d0a0a', '#141414']}
            style={styles.insightCard}
          >
            <Text style={styles.insightText}>"{insight}"</Text>
          </LinearGradient>

          {/* Avg shame ring */}
          <View style={styles.ringSection}>
            <View style={styles.ringCard}>
              <ProgressRing
                size={150}
                strokeWidth={12}
                progress={avgScore}
                color={shameInfo.color}
                centerValue={`${avgScore}`}
                label="ORT. SHAME"
              />
            </View>
            <View style={styles.ringSideStats}>
              <View style={styles.ringStat}>
                <Text style={styles.ringStatValue}>{weeklyHours}s</Text>
                <Text style={styles.ringStatLabel}>haftalık toplam</Text>
              </View>
              <View style={styles.ringStat}>
                <Text style={styles.ringStatValue}>{avgMinutes}dk</Text>
                <Text style={styles.ringStatLabel}>günlük ortalama</Text>
              </View>
              <View style={[styles.ringStat, { borderColor: shameInfo.color + '40' }]}>
                <Text style={[styles.ringStatValue, { color: shameInfo.color }]}>
                  {shameInfo.emoji} {shameInfo.label}
                </Text>
                <Text style={styles.ringStatLabel}>genel durum</Text>
              </View>
            </View>
          </View>

          {/* Weekly chart */}
          <GradientCard style={styles.chartCard} gradient={['#141414', '#0f0f0f']}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Haftalık Scroll</Text>
              <Text style={styles.chartSub}>dakika cinsinden</Text>
            </View>
            <WeeklyBarChart logs={logs} />
          </GradientCard>

          {/* App breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uygulama Analizi</Text>
            <GradientCard gradient={['#141414', '#0f0f0f']} style={styles.appCard}>
              {totalAppMinutes === 0 ? (
                <Text style={styles.topAppMinutes}>Bu haftaya ait uygulama verisi yok.</Text>
              ) : (
              <View style={styles.topAppRow}>
                <Text style={styles.topAppLabel}>En Çok Kullanılan</Text>
                <Text style={[styles.topAppName, { color: APP_COLORS[topApp[0]] }]}>
                  {APP_ICONS[topApp[0]]} {topApp[0]}
                </Text>
                <Text style={styles.topAppMinutes}>{topApp[1]} dakika bu hafta</Text>
              </View>
              )}

              {totalAppMinutes > 0 && (
              <View style={styles.appList}>
                {mostUsed.map(([app, minutes]) => {
                  const pct = (minutes / totalAppMinutes) * 100;
                  return (
                    <View key={app} style={styles.appRow}>
                      <View style={styles.appInfo}>
                        <Text style={styles.appIcon}>{APP_ICONS[app]}</Text>
                        <Text style={styles.appName}>{app}</Text>
                      </View>
                      <View style={styles.appBarContainer}>
                        <View
                          style={[
                            styles.appBar,
                            { width: `${pct}%`, backgroundColor: APP_COLORS[app] },
                          ]}
                        />
                      </View>
                      <Text style={[styles.appMinutes, { color: APP_COLORS[app] }]}>
                        {minutes}dk
                      </Text>
                    </View>
                  );
                })}
              </View>
              )}
            </GradientCard>
          </View>

          {/* Shame score history */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shame Score Geçmişi</Text>
            <View style={styles.scoreHistory}>
              {logs.slice(-7).map((log, i) => {
                const info = getShameLabel(log.shameScore);
                const date = new Date(log.date + 'T12:00:00');
                const dayLabel = date.toLocaleDateString('tr-TR', { weekday: 'short' });
                return (
                  <View key={log.date} style={styles.scoreHistoryItem}>
                    <Text style={styles.scoreHistoryDay}>{dayLabel}</Text>
                    <View
                      style={[
                        styles.scoreHistoryBadge,
                        { backgroundColor: info.color + '20', borderColor: info.color + '40' },
                      ]}
                    >
                      <Text style={[styles.scoreHistoryValue, { color: info.color }]}>
                        {log.shameScore}
                      </Text>
                    </View>
                    <Text style={styles.scoreHistoryMinutes}>{log.total}dk</Text>
                  </View>
                );
              })}
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
  header: { paddingTop: Spacing.lg, paddingBottom: Spacing.md, gap: 4 },
  title: { ...Typography.h1, color: Colors.text, letterSpacing: -1 },
  sub: { ...Typography.body, color: Colors.textMuted },
  insightCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    marginBottom: Spacing.lg,
  },
  insightText: { ...Typography.body, color: Colors.textSecondary, fontStyle: 'italic', lineHeight: 24 },
  ringSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.lg,
  },
  ringCard: { alignItems: 'center' },
  ringSideStats: { flex: 1, gap: Spacing.md },
  ringStat: {
    gap: 2,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  ringStatValue: { ...Typography.h3, color: Colors.text },
  ringStatLabel: { ...Typography.caption, color: Colors.textMuted },
  chartCard: { padding: Spacing.lg, marginBottom: Spacing.lg },
  chartHeader: { marginBottom: Spacing.md, gap: 2 },
  chartTitle: { ...Typography.h4, color: Colors.text },
  chartSub: { ...Typography.caption, color: Colors.textMuted },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { ...Typography.h4, color: Colors.textSecondary, marginBottom: Spacing.md },
  appCard: { padding: Spacing.lg },
  topAppRow: { gap: 4, marginBottom: Spacing.md },
  topAppLabel: { ...Typography.caption, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  topAppName: { ...Typography.h2, letterSpacing: -0.5 },
  topAppMinutes: { ...Typography.bodySmall, color: Colors.textSecondary },
  appList: { gap: Spacing.md },
  appRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  appInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, width: 96 },
  appIcon: { fontSize: 14 },
  appName: { ...Typography.bodySmall, color: Colors.textSecondary, flex: 1 },
  appBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  appBar: { height: 6, borderRadius: 3, minWidth: 4 },
  appMinutes: { ...Typography.bodySmall, fontWeight: '700', width: 40, textAlign: 'right' },
  scoreHistory: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  scoreHistoryItem: { flex: 1, alignItems: 'center', gap: 4 },
  scoreHistoryDay: { ...Typography.caption, color: Colors.textMuted },
  scoreHistoryBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  scoreHistoryValue: { ...Typography.bodySmall, fontWeight: '800' },
  scoreHistoryMinutes: { fontSize: 9, color: Colors.textMuted },
});
