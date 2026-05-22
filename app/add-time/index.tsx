import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { useAppStore } from '../../store/useAppStore';
import { NativeModules } from 'react-native';

// Expo Go'da native modül olmaz — güvenli fallback
const _Native = NativeModules.UsageStats ?? null;
const UsageStatsModule = {
  isAvailable: () => Platform.OS === 'android' && _Native != null,
  hasPermission: (): boolean => { try { return _Native?.hasPermission?.() ?? false; } catch { return false; } },
  openPermissionSettings: () => { try { _Native?.openPermissionSettings?.(); } catch {} },
  getTodayUsage: async (): Promise<{ tiktok: number; instagram: number; youtube: number; twitter: number } | null> => {
    try { return await _Native?.getTodayUsage(); } catch { return null; }
  },
};

const PLATFORMS = [
  { key: 'tiktok',     label: 'TikTok',          icon: '🎵', color: '#FF0050' },
  { key: 'instagram',  label: 'Instagram',        icon: '📷', color: '#E1306C' },
  { key: 'youtube',    label: 'YouTube Shorts',   icon: '▶️', color: '#FF0000' },
  { key: 'twitter',    label: 'Twitter / X',      icon: '𝕏', color: '#1DA1F2' },
] as const;

type PlatformKey = typeof PLATFORMS[number]['key'];

const QUICK_ADD = [10, 20, 30, 60];

type State = Record<PlatformKey, string>;

export default function AddTimeScreen() {
  const logScrollTime = useAppStore((s) => s.logScrollTime);
  const currentDay   = useAppStore((s) => s.currentDay);

  // Bugün zaten kayıt varsa formü onunla başlat
  const initialValues: State = {
    tiktok:    currentDay?.tiktok    ? String(currentDay.tiktok)    : '',
    instagram: currentDay?.instagram ? String(currentDay.instagram) : '',
    youtube:   currentDay?.youtube   ? String(currentDay.youtube)   : '',
    twitter:   currentDay?.twitter   ? String(currentDay.twitter)   : '',
  };

  const [values, setValues] = useState<State>(initialValues);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [permissionNeeded, setPermissionNeeded] = useState(false);

  const total = (Object.values(values) as string[]).reduce((s, v) => s + (parseInt(v) || 0), 0);
  const isAndroid = UsageStatsModule.isAvailable();

  // Android: otomatik çekmeyi dene
  const tryAutoFetch = useCallback(async () => {
    if (!isAndroid) return;
    setAutoLoading(true);
    try {
      const hasPerm = UsageStatsModule.hasPermission();
      if (!hasPerm) {
        setPermissionNeeded(true);
        setAutoLoading(false);
        return;
      }
      const data = await UsageStatsModule.getTodayUsage();
      if (data) {
        setValues({
          tiktok:    String(data.tiktok),
          instagram: String(data.instagram),
          youtube:   String(data.youtube),
          twitter:   String(data.twitter),
        });
        setAutoLoaded(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (_) {}
    setAutoLoading(false);
  }, [isAndroid]);

  useEffect(() => { tryAutoFetch(); }, [tryAutoFetch]);

  const handleGrantPermission = () => {
    UsageStatsModule.openPermissionSettings();
    setPermissionNeeded(false);
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    logScrollTime(
      parseInt(values.tiktok)    || 0,
      parseInt(values.instagram) || 0,
      parseInt(values.youtube)   || 0,
      parseInt(values.twitter)   || 0,
    );
    router.back();
  };

  const addQuick = (key: PlatformKey, minutes: number) => {
    Haptics.selectionAsync();
    setValues((prev) => ({
      ...prev,
      [key]: String((parseInt(prev[key]) || 0) + minutes),
    }));
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Text style={styles.backText}>← Geri</Text>
              </TouchableOpacity>

              {isAndroid ? (
                <>
                  <Text style={styles.title}>Bugünün scroll verisi</Text>
                  {autoLoaded ? (
                    <View style={styles.autoBadge}>
                      <Text style={styles.autoBadgeText}>✓ Telefondan otomatik çekildi</Text>
                    </View>
                  ) : (
                    <Text style={styles.subtitle}>Veriler otomatik çekiliyor…</Text>
                  )}
                </>
              ) : (
                <>
                  <Text style={styles.title}>Bugünkü scrollunu gir.</Text>
                  <Text style={styles.subtitle}>Dürüst ol. Kendini kandırma.</Text>
                </>
              )}
            </View>

            {/* Android: izin gerekiyor */}
            {permissionNeeded && (
              <TouchableOpacity onPress={handleGrantPermission} activeOpacity={0.85}>
                <LinearGradient
                  colors={['#2d1507', '#1a0a00']}
                  style={styles.permissionCard}
                >
                  <Text style={styles.permissionTitle}>📊 Kullanım İzni Gerekiyor</Text>
                  <Text style={styles.permissionDesc}>
                    Scroll süresini otomatik takip etmek için Ayarlar → Kullanım Erişimi → Scroll Shame'e izin ver.
                  </Text>
                  <View style={styles.permissionBtn}>
                    <Text style={styles.permissionBtnText}>İzin Ver →</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Android: yükleniyor */}
            {autoLoading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={Colors.primary} />
                <Text style={styles.loadingText}>Veriler çekiliyor…</Text>
              </View>
            )}

            {/* Toplam özet */}
            {total > 0 && (
              <LinearGradient colors={['#2d0a0a', '#1a0a0a']} style={styles.totalCard}>
                <Text style={styles.totalLabel}>Toplam</Text>
                <Text style={styles.totalValue}>{total} dakika</Text>
                <Text style={styles.totalHours}>= {(total / 60).toFixed(1)} saat</Text>
              </LinearGradient>
            )}

            {/* Platform girişleri */}
            {PLATFORMS.map((p) => (
              <View key={p.key}>
                <View style={styles.inputRow}>
                  <View style={[styles.platformIcon, { backgroundColor: p.color + '20' }]}>
                    <Text style={styles.platformEmoji}>{p.icon}</Text>
                  </View>
                  <View style={styles.inputRight}>
                    <Text style={styles.platformLabel}>{p.label}</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={values[p.key]}
                        onChangeText={(v) =>
                          setValues((prev) => ({ ...prev, [p.key]: v.replace(/[^0-9]/g, '') }))
                        }
                        placeholder="0"
                        placeholderTextColor={Colors.textMuted}
                        keyboardType="number-pad"
                        maxLength={3}
                      />
                      <Text style={styles.inputUnit}>dk</Text>
                    </View>
                  </View>
                </View>

                {/* iOS quick-add butonları */}
                {!isAndroid && (
                  <View style={styles.quickRow}>
                    {QUICK_ADD.map((min) => (
                      <TouchableOpacity
                        key={min}
                        onPress={() => addQuick(p.key, min)}
                        style={[styles.quickBtn, { borderColor: p.color + '50' }]}
                      >
                        <Text style={[styles.quickBtnText, { color: p.color }]}>+{min}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      onPress={() => setValues((prev) => ({ ...prev, [p.key]: '0' }))}
                      style={styles.quickBtnReset}
                    >
                      <Text style={styles.quickBtnResetText}>Sıfırla</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}

            {/* Android: yenile butonu */}
            {isAndroid && !permissionNeeded && (
              <TouchableOpacity
                onPress={tryAutoFetch}
                style={styles.refreshBtn}
                disabled={autoLoading}
              >
                <Text style={styles.refreshText}>
                  {autoLoading ? '⟳ Yenileniyor…' : '⟳ Yenile'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Kaydet */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={total === 0}
              activeOpacity={0.8}
              style={[styles.saveBtn, total === 0 && { opacity: 0.4 }]}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.orange]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveGradient}
              >
                <Text style={styles.saveText}>Kaydet & Hesapla</Text>
              </LinearGradient>
            </TouchableOpacity>

            {!isAndroid && (
              <Text style={styles.footerNote}>
                Otomatik takip yalnızca Android'de kullanılabilir.
              </Text>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:           { flex: 1, backgroundColor: Colors.background },
  safe:           { flex: 1 },
  content:        { padding: Spacing.xl, gap: Spacing.md, paddingBottom: Spacing.xxxl },

  header:         { gap: Spacing.sm, marginBottom: Spacing.sm },
  backBtn:        { alignSelf: 'flex-start', marginBottom: Spacing.sm },
  backText:       { ...Typography.body, color: Colors.textSecondary },
  title:          { ...Typography.h1, color: Colors.text, letterSpacing: -1 },
  subtitle:       { ...Typography.body, color: Colors.textMuted },

  autoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.recovery + '20',
    borderWidth: 1,
    borderColor: Colors.recovery + '50',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  autoBadgeText:  { ...Typography.bodySmall, color: Colors.recovery, fontWeight: '700' },

  permissionCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.orange + '40',
    gap: Spacing.sm,
  },
  permissionTitle: { ...Typography.h4, color: Colors.orange },
  permissionDesc:  { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 20 },
  permissionBtn: {
    backgroundColor: Colors.orange + '25',
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  permissionBtnText: { ...Typography.h4, color: Colors.orange },

  loadingRow:     { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  loadingText:    { ...Typography.body, color: Colors.textSecondary },

  totalCard:      { padding: Spacing.lg, borderRadius: Radius.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.primary + '40' },
  totalLabel:     { ...Typography.label, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 2 },
  totalValue:     { fontSize: 42, fontWeight: '800', color: Colors.primary, letterSpacing: -1 },
  totalHours:     { ...Typography.body, color: Colors.textSecondary },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  platformIcon:   { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  platformEmoji:  { fontSize: 22 },
  inputRight:     { flex: 1, gap: 4 },
  platformLabel:  { ...Typography.bodySmall, color: Colors.textSecondary },
  inputContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  input:          { ...Typography.h2, color: Colors.text, minWidth: 60, padding: 0 },
  inputUnit:      { ...Typography.body, color: Colors.textMuted },

  quickRow:       { flexDirection: 'row', gap: Spacing.xs, paddingLeft: 64, marginTop: -4, marginBottom: Spacing.xs, flexWrap: 'wrap' },
  quickBtn:       { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1 },
  quickBtnText:   { fontSize: 11, fontWeight: '700' },
  quickBtnReset:  { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border },
  quickBtnResetText: { fontSize: 11, color: Colors.textMuted },

  refreshBtn:     { alignSelf: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
  refreshText:    { ...Typography.body, color: Colors.textMuted },

  saveBtn:        { borderRadius: Radius.full, overflow: 'hidden', marginTop: Spacing.md },
  saveGradient:   { height: 56, alignItems: 'center', justifyContent: 'center' },
  saveText:       { ...Typography.h4, color: Colors.text },
  footerNote:     { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },
});
