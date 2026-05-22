import React, { useEffect } from 'react';
import type { DailyLog } from '../../types';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { ShameHeroCard } from '../../components/home/ShameHeroCard';
import { ConversionCards } from '../../components/home/ConversionCards';
import { DailyMessage } from '../../components/home/DailyMessage';
import { StatBadge } from '../../components/ui/StatBadge';
import { useAppStore } from '../../store/useAppStore';

export default function HomeScreen() {
  const { currentDay, streak, brainRecoveryScore, totalXP, dailyLogs, loadState, username } = useAppStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadState();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadState();
    setRefreshing(false);
  };

  const weekAvg = dailyLogs.length > 0
    ? Math.round(dailyLogs.slice(-7).reduce((s, l) => s + l.total, 0) / Math.min(dailyLogs.length, 7))
    : 0;

  const shameScore = currentDay?.shameScore ?? 0;
  const totalMinutes = currentDay?.total ?? 0;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        <SafeAreaView edges={['top']}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Merhaba, {username || 'hey'} 👋</Text>
              <Text style={styles.headerTitle}>Scroll Shame</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>⚡ {totalXP} XP</Text>
            </View>
          </View>

          {/* Rotating message */}
          <DailyMessage shameScore={shameScore} streak={streak} />

          {/* Hero Card */}
          <View style={styles.section}>
            <ShameHeroCard log={currentDay} />
          </View>

          {/* Quick stats */}
          <View style={styles.statsRow}>
            <StatBadge
              icon={streak > 0 ? "🔥" : "💤"}
              label="Streak"
              value={streak > 0 ? `${streak} gün` : "Başla"}
              color={streak > 0 ? Colors.orange : Colors.textMuted}
            />
            <StatBadge
              icon="🧠"
              label="Brain Recovery"
              value={dailyLogs.length > 0 ? `${brainRecoveryScore}%` : "—"}
              color={dailyLogs.length > 0 ? Colors.recovery : Colors.textMuted}
            />
            <StatBadge
              icon="📊"
              label="Haftalık Ort."
              value={weekAvg > 0 ? `${weekAvg} dk` : "—"}
              color={weekAvg > 0 ? Colors.purple : Colors.textMuted}
            />
          </View>

          {/* Conversion cards */}
          <View style={styles.section}>
            <ConversionCards totalMinutes={totalMinutes} />
          </View>

          {/* App distribution */}
          {currentDay && currentDay.total > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Uygulama dağılımı</Text>
              <AppDistribution log={currentDay} />
            </View>
          )}

          {/* Daily Recap butonu — bugün veri varsa göster */}
          {currentDay && currentDay.total > 0 && (
            <TouchableOpacity
              style={styles.recapBtn}
              onPress={() => router.push('/daily-recap')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#1a0a0a', '#2d0a0a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.recapBtnInner}
              >
                <Text style={styles.recapBtnEmoji}>🌙</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recapBtnTitle}>Günlük Özet</Text>
                  <Text style={styles.recapBtnSub}>Bugün ne kaybettiğini gör</Text>
                </View>
                <Text style={styles.recapBtnArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={{ height: Spacing.xxxl }} />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

function AppDistribution({ log }: { log: DailyLog }) {
  const apps = [
    { key: 'TikTok', value: log.tiktok, color: '#FF0050', icon: '🎵' },
    { key: 'Instagram', value: log.instagram, color: '#E1306C', icon: '📷' },
    { key: 'YouTube', value: log.youtube, color: '#FF0000', icon: '▶️' },
    { key: 'Twitter', value: log.twitter, color: '#1DA1F2', icon: '𝕏' },
  ].filter((a) => a.value > 0);

  const total = apps.reduce((s, a) => s + a.value, 0);

  return (
    <View style={styles.distContainer}>
      <View style={styles.barContainer}>
        {apps.map((app) => (
          <View
            key={app.key}
            style={[
              styles.barSegment,
              { flex: app.value / total, backgroundColor: app.color },
            ]}
          />
        ))}
      </View>
      <View style={styles.distLegend}>
        {apps.map((app) => (
          <View key={app.key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: app.color }]} />
            <Text style={styles.legendText}>{app.icon} {app.key}</Text>
            <Text style={[styles.legendValue, { color: app.color }]}>{app.value}dk</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  xpBadge: {
    backgroundColor: Colors.gold + '20',
    borderWidth: 1,
    borderColor: Colors.gold + '40',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  xpText: {
    ...Typography.bodySmall,
    color: Colors.gold,
    fontWeight: '700',
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  distContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  barContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    gap: 2,
  },
  barSegment: {
    borderRadius: 4,
  },
  distLegend: {
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },
  legendValue: {
    ...Typography.bodySmall,
    fontWeight: '700',
  },
  recapBtn: {
    marginTop: Spacing.lg,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  recapBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  recapBtnEmoji: { fontSize: 24 },
  recapBtnTitle: { ...Typography.h4, color: Colors.text },
  recapBtnSub: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  recapBtnArrow: { ...Typography.h3, color: Colors.primary },
});
