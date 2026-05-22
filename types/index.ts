export type Goal =
  | 'focus'
  | 'less_social'
  | 'study'
  | 'coding'
  | 'fitness'
  | 'dopamine_detox';

export interface DailyLog {
  date: string;
  tiktok: number;
  instagram: number;
  youtube: number;
  twitter: number;
  total: number;
  shameScore: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xp: number;
  duration: number;
  icon: string;
  category: 'outdoor' | 'mindfulness' | 'health' | 'focus' | 'social';
  completed: boolean;
  completedAt?: string;
}

export interface AppState {
  hasOnboarded: boolean;
  selectedGoals: Goal[];
  username: string;
  dailyLogs: DailyLog[];
  streak: number;
  totalXP: number;
  completedChallenges: string[];
  brainRecoveryScore: number;
  currentDay: DailyLog | null;
}

export interface ShameConversion {
  icon: string;
  label: string;
  value: string;
  color: string;
}
