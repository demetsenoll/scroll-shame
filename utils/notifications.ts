import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(): Promise<void> {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) return;

    // Cancel any existing reminders before rescheduling
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Evening reminder — 21:00 daily
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Scroll Shame',
        body: 'Bugünkü scroll süresini girdin mi? Farkındalık bir alışkanlık.',
        data: { screen: 'add-time' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 21,
        minute: 0,
      },
    });
  } catch {
    // Notifications are non-critical — swallow errors
  }
}

export async function cancelAllReminders(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
}
