import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { useAppStore } from '../../store/useAppStore';
import { getShameLabel } from '../../utils/shameEngine';

const GOAL_LABELS: Record<string, string> = {
  focus: '🎯 Daha İyi Odak',
  less_social: '📵 Daha Az Sosyal Medya',
  study: '📚 Ders Çalışma',
  coding: '💻 Yazılım Öğrenme',
  fitness: '💪 Fitness',
  dopamine_detox: '🧘 Dopamin Detoksu',
};

export default function ProfileScreen() {
  const {
    username,
    selectedGoals,
    streak,
    totalXP,
    brainRecoveryScore,
    completedChallenges,
    dailyLogs,
    resetAllData,
  } = useAppStore();

  const weeklyLogs = dailyLogs.slice(-7);
  const weeklyAvg = weeklyLogs.length > 0
    ? Math.round(weeklyLogs.reduce((s, l) => s + l.total, 0) / weeklyLogs.length)
    : 0;
  const allTimeTotal = dailyLogs.reduce((s, l) => s + l.total, 0);
  const allTimeHours = (allTimeTotal / 60).toFixed(1);
  const avgShame = weeklyLogs.length > 0
    ? Math.round(weeklyLogs.reduce((s, l) => s + l.shameScore, 0) / weeklyLogs.length)
    : 0;
  const shameInfo = getShameLabel(avgShame);
  const savedMinutes = completedChallenges.length * 15;

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const message = dailyLogs.length > 0
      ? `📱 Scroll Shame ile ekran süremimi takip ediyorum.\n\n🔥 ${streak} günlük streak\n⚡ ${totalXP} XP\n🧠 Brain Recovery: ${brainRecoveryScore}%\n📊 Haftalık ort: ${weeklyAvg} dk/gün\n\nSen de farkında ol.`
      : `📱 Scroll Shame ile ekran kullanımımı takip etmeye başladım.\n\n🔥 ${streak} günlük streak\n⚡ ${totalXP} XP\n🧠 Brain Recovery: ${brainRecoveryScore}%\n\nSen de farkında ol.`;
    try {
      await Share.share({ message });
    } catch (_) {}
  };

  const handleReset = () => {
    Alert.alert(
      'Verileri Sıfırla',
      'Tüm veriler silinecek ve yeniden başlayacaksın. Emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={['top']}>
          {/* Hero section */}
          <LinearGradient
            colors={['#1a0a2d', '#0a0a0a']}
            style={styles.heroCard}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {username ? username.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
            <Text style={styles.username}>{username || 'Kullanıcı'}</Text>
            <Text style={styles.userTagline}>Dopamin Farkındalığı Yolcusu</Text>

            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>🔥 {streak}</Text>
                <Text style={styles.heroStatLabel}>Streak</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>⚡ {totalXP}</Text>
                <Text style={styles.heroStatLabel}>XP</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>✅ {completedChallenges.length}</Text>
                <Text style={styles.heroStatLabel}>Görev</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Shareable card */}
          <TouchableOpacity onPress={handleShare} activeOpacity={0.85}>
            <LinearGradient
              colors={[Colors.primary, Colors.orange]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.shareCard}
            >
              <View style={styles.shareCardInner}>
                <View>
                  <Text style={styles.shareCardTitle}>Bu hafta</Text>
                  <Text style={styles.shareCardBig}>
                    {weeklyAvg > 0 ? `${weeklyAvg} dk/gün` : '—'}
                  </Text>
                  <Text style={styles.shareCardSub}>ortalama scroll</Text>
                </View>
                <View style={styles.shareStats}>
                  <Text style={styles.shareStatItem}>
                    🧠 {brainRecoveryScore}% toparlanma
                  </Text>
                  <Text style={styles.shareStatItem}>
                    {shameInfo.emoji} {shameInfo.label} seviyesi
                  </Text>
                  <Text style={styles.shareStatItem}>
                    ⚡ {totalXP} XP kazanıldı
                  </Text>
                </View>
              </View>
              <View style={styles.shareBtn}>
                <Text style={styles.shareBtnText}>Paylaş ↗</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* All time stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tüm Zamanlar</Text>
            <View style={styles.statsGrid}>
              {[
                { label: 'Toplam Scroll', value: dailyLogs.length > 0 ? `${allTimeHours}s` : '—', icon: '📱', color: Colors.primary },
                { label: 'Haftalık Ort.', value: weeklyAvg > 0 ? `${weeklyAvg}dk` : '—', icon: '📊', color: Colors.orange },
                { label: 'Kayıp Gün', value: dailyLogs.length > 0 ? `${(allTimeTotal / 1440).toFixed(1)}` : '—', icon: '💀', color: Colors.primaryDark },
                { label: 'Kazanılan Süre', value: savedMinutes > 0 ? `${savedMinutes}dk` : '—', icon: '🌿', color: Colors.recovery },
              ].map((stat, i) => (
                <View
                  key={i}
                  style={[styles.statCard, { borderColor: stat.color + '30', backgroundColor: stat.color + '10' }]}
                >
                  <Text style={styles.statIcon}>{stat.icon}</Text>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Goals */}
          {selectedGoals.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hedeflerim</Text>
              <View style={styles.goalsList}>
                {selectedGoals.map((goal) => (
                  <View key={goal} style={styles.goalItem}>
                    <Text style={styles.goalText}>{GOAL_LABELS[goal] ?? goal}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Danger zone */}
          <View style={styles.section}>
            <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
              <Text style={styles.resetText}>Verileri Sıfırla</Text>
            </TouchableOpacity>
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
  heroCard: {
    marginTop: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.purple + '30',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: Colors.text },
  username: { ...Typography.h2, color: Colors.text, letterSpacing: -0.5 },
  userTagline: { ...Typography.bodySmall, color: Colors.textMuted },
  heroStats: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    backgroundColor: Colors.background + '80',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    width: '100%',
  },
  heroStat: { flex: 1, alignItems: 'center', gap: 2 },
  heroStatValue: { ...Typography.h4, color: Colors.text },
  heroStatLabel: { ...Typography.caption, color: Colors.textMuted },
  heroStatDivider: { width: 1, backgroundColor: Colors.border },
  shareCard: {
    marginTop: Spacing.lg,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  shareCardInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  shareCardTitle: { ...Typography.caption, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 },
  shareCardBig: { fontSize: 34, fontWeight: '800', color: Colors.text, letterSpacing: -1 },
  shareCardSub: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.7)' },
  shareStats: { gap: 4, alignItems: 'flex-end' },
  shareStatItem: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.85)' },
  shareBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    alignSelf: 'flex-start',
  },
  shareBtnText: { ...Typography.h4, color: Colors.text },
  section: { marginTop: Spacing.xl },
  sectionTitle: { ...Typography.h4, color: Colors.textSecondary, marginBottom: Spacing.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: {
    width: '48%',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.xs,
    alignItems: 'center',
  },
  statIcon: { fontSize: 24 },
  statValue: { ...Typography.h3 },
  statLabel: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },
  goalsList: { gap: Spacing.sm },
  goalItem: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  goalText: { ...Typography.body, color: Colors.textSecondary },
  resetBtn: {
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
  },
  resetText: { ...Typography.body, color: Colors.primary },
});
