import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { ChallengeCard } from '../../components/challenges/ChallengeCard';
import { useAppStore } from '../../store/useAppStore';
import { CHALLENGES } from '../../utils/mockData';

const FILTER_TABS = [
  { id: 'all', label: 'Hepsi' },
  { id: 'outdoor', label: '🌿 Dışarı' },
  { id: 'mindfulness', label: '🧘 Zihin' },
  { id: 'health', label: '💪 Sağlık' },
  { id: 'focus', label: '🎯 Odak' },
  { id: 'social', label: '👥 Sosyal' },
];

export default function ChallengesScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { completedChallenges, totalXP, completeChallenge } = useAppStore();

  const filtered = CHALLENGES.filter(
    (c) => activeFilter === 'all' || c.category === activeFilter
  );

  const completedCount = completedChallenges.length;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Touch Grass</Text>
              <Text style={styles.sub}>Gerçek hayat seni bekliyor.</Text>
            </View>
          </View>

          {/* Progress */}
          <LinearGradient
            colors={['#022c22', '#111111']}
            style={styles.progressCard}
          >
            <View style={styles.progressRow}>
              <View>
                <Text style={styles.progressLabel}>Tamamlanan</Text>
                <Text style={styles.progressValue}>
                  {completedCount} / {CHALLENGES.length}
                </Text>
              </View>
              <View style={styles.xpDisplay}>
                <Text style={styles.xpValue}>⚡ {totalXP}</Text>
                <Text style={styles.xpLabel}>XP Kazanıldı</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${(completedCount / CHALLENGES.length) * 100}%`,
                  },
                ]}
              />
            </View>
          </LinearGradient>

          {/* Filter tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabs}
          >
            {FILTER_TABS.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveFilter(tab.id)}
                style={[
                  styles.tab,
                  activeFilter === tab.id && styles.tabActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeFilter === tab.id && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Challenge list */}
          <View style={styles.list}>
            {filtered.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isCompleted={completedChallenges.includes(challenge.id)}
                onComplete={() => completeChallenge(challenge.id, challenge.xp)}
              />
            ))}
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
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: { ...Typography.h1, color: Colors.text, letterSpacing: -1 },
  sub: { ...Typography.body, color: Colors.textMuted },
  progressCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.recovery + '30',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  progressLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressValue: {
    ...Typography.h2,
    color: Colors.recovery,
  },
  xpDisplay: { alignItems: 'flex-end' },
  xpValue: { ...Typography.h3, color: Colors.gold },
  xpLabel: { ...Typography.caption, color: Colors.textMuted },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.recovery,
    borderRadius: 3,
  },
  tabs: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
    paddingRight: Spacing.xl,
  },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  tabActive: {
    borderColor: Colors.recovery,
    backgroundColor: Colors.recovery + '20',
  },
  tabText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.recovery,
    fontWeight: '700',
  },
  list: {
    gap: Spacing.sm,
  },
});
