import { Platform, NativeModules } from 'react-native';

export interface UsageData {
  tiktok: number;
  instagram: number;
  youtube: number;
  twitter: number;
}

const Native = Platform.OS === 'android' ? NativeModules.UsageStats : null;

export const UsageStatsModule = {
  isAvailable: (): boolean => Platform.OS === 'android' && Native != null,

  hasPermission: (): boolean => {
    try {
      return Native?.hasPermission?.() ?? false;
    } catch {
      return false;
    }
  },

  openPermissionSettings: (): void => {
    Native?.openPermissionSettings?.();
  },

  getTodayUsage: async (): Promise<UsageData | null> => {
    if (!Native) return null;
    try {
      return await Native.getTodayUsage();
    } catch {
      return null;
    }
  },
};
