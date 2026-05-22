import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Goal, DailyLog, AppState } from '../types';

const STORAGE_KEY = 'scroll_shame_state';

const today = () => new Date().toISOString().split('T')[0];

const calcShameScore = (totalMinutes: number): number => {
  if (totalMinutes <= 15) return 5;
  if (totalMinutes <= 30) return 15;
  if (totalMinutes <= 60) return 30;
  if (totalMinutes <= 90) return 45;
  if (totalMinutes <= 120) return 60;
  if (totalMinutes <= 180) return 75;
  if (totalMinutes <= 240) return 88;
  return Math.min(100, 88 + Math.floor((totalMinutes - 240) / 30));
};

const calcBrainRecovery = (logs: DailyLog[], challengeCount = 0): number => {
  if (logs.length === 0) return 50;
  const recent = logs.slice(-7);
  const avg = recent.reduce((s, l) => s + l.total, 0) / recent.length;
  let base: number;
  if (avg <= 30) base = 95;
  else if (avg <= 60) base = 80;
  else if (avg <= 90) base = 65;
  else if (avg <= 120) base = 50;
  else if (avg <= 180) base = 35;
  else base = 20;
  // Challenges provide up to +15 bonus (3 points each, capped)
  const bonus = Math.min(15, challengeCount * 3);
  return Math.min(100, base + bonus);
};

interface Store extends AppState {
  setOnboarded: (goals: Goal[], username?: string) => void;
  logScrollTime: (tiktok: number, instagram: number, youtube: number, twitter: number) => void;
  completeChallenge: (id: string, xp: number) => void;
  loadState: () => Promise<void>;
  resetDay: () => void;
  resetAllData: () => Promise<void>;
}

const defaultState: AppState = {
  hasOnboarded: false,
  selectedGoals: [],
  username: '',
  dailyLogs: [],
  streak: 0,
  totalXP: 0,
  completedChallenges: [],
  brainRecoveryScore: 50,
  currentDay: null,
};

export const useAppStore = create<Store>((set, get) => ({
  ...defaultState,

  setOnboarded: (goals, username = 'User') => {
    const newState = { hasOnboarded: true, selectedGoals: goals, username };
    set(newState);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), ...newState }));
  },

  logScrollTime: (tiktok, instagram, youtube, twitter) => {
    const total = tiktok + instagram + youtube + twitter;
    const shameScore = calcShameScore(total);
    const newLog: DailyLog = {
      date: today(),
      tiktok,
      instagram,
      youtube,
      twitter,
      total,
      shameScore,
    };

    const todayStr = today();
    const alreadyLoggedToday = get().dailyLogs.some((l) => l.date === todayStr);
    const prevLogs = get().dailyLogs.filter((l) => l.date !== todayStr);
    const logs = [...prevLogs, newLog];

    const brainRecoveryScore = calcBrainRecovery(logs, get().completedChallenges.length);

    // Only recalculate streak on the first log of each day
    let streak = get().streak;
    if (!alreadyLoggedToday) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split('T')[0];
      const lastLog = prevLogs[prevLogs.length - 1];
      streak = lastLog?.date === yStr ? streak + 1 : 1;
    }

    const newState = { dailyLogs: logs, currentDay: newLog, brainRecoveryScore, streak };
    set(newState);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), ...newState }));
  },

  completeChallenge: (id, xp) => {
    if (get().completedChallenges.includes(id)) return;
    const completed = [...get().completedChallenges, id];
    const totalXP = get().totalXP + xp;
    const brainRecoveryScore = Math.min(100, get().brainRecoveryScore + 5);
    set({ completedChallenges: completed, totalXP, brainRecoveryScore });
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...get(), completedChallenges: completed, totalXP, brainRecoveryScore })
    );
  },

  resetDay: () => {
    set({ currentDay: null });
  },

  resetAllData: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ ...defaultState });
  },

  loadState: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);

        // Don't restore yesterday's currentDay as today's
        if (saved.currentDay && saved.currentDay.date !== today()) {
          saved.currentDay = null;
        }

        // Reset streak if the last log is older than yesterday
        if (saved.streak > 0 && saved.dailyLogs?.length > 0) {
          const lastLogDate = saved.dailyLogs[saved.dailyLogs.length - 1].date;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yStr = yesterday.toISOString().split('T')[0];
          const todayStr = today();
          if (lastLogDate !== yStr && lastLogDate !== todayStr) {
            saved.streak = 0;
          }
        }

        set({ ...defaultState, ...saved });
      }
    } catch (_) {}
  },
}));
