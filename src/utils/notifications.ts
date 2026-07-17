import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Subscription } from '../store/subscriptionsStore';
import i18n from '../i18n';
import { formatLongDate } from './format';

const CHANNEL_ID = 'reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
}

export type NotificationPermissionState = { granted: boolean; canAskAgain: boolean };

export async function getNotificationPermissionState(): Promise<NotificationPermissionState> {
  if (Platform.OS === 'web') return { granted: false, canAskAgain: false };
  const result = await Notifications.getPermissionsAsync();
  return { granted: !!result.granted, canAskAgain: result.canAskAgain !== false };
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (Platform.OS === 'web') return { granted: false, canAskAgain: false };
  await ensureNotificationChannel();
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return { granted: true, canAskAgain: true };
  if (!existing.canAskAgain) return { granted: false, canAskAgain: false };
  const result = await Notifications.requestPermissionsAsync();
  return { granted: !!result.granted, canAskAgain: result.canAskAgain !== false };
}

function scheduleFor(subId: string, offsetLabel: string, date: Date, title: string, body: string) {
  return Notifications.scheduleNotificationAsync({
    identifier: `${subId}:${offsetLabel}`,
    content: { title, body },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
  });
}

export async function syncReminderNotifications(subscriptions: Subscription[], enabled: boolean) {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!enabled) return;

  const perm = await Notifications.getPermissionsAsync();
  if (!perm.granted) return;

  await ensureNotificationChannel();
  const now = Date.now();

  for (const sub of subscriptions) {
    if (sub.status !== 'active' && sub.status !== 'trial') continue;

    if (sub.reminders.renewalReminder) {
      const billingDate = new Date(sub.nextBillingDate);
      for (const days of sub.reminders.daysBefore) {
        const fireDate = new Date(billingDate);
        fireDate.setDate(fireDate.getDate() - days);
        if (fireDate.getTime() > now) {
          await scheduleFor(
            sub.id,
            `renew-${days}`,
            fireDate,
            i18n.t('notifications.renewsInTitle', { name: sub.name, count: days }),
            i18n.t('notifications.renewsOnBody', { name: sub.name, date: formatLongDate(sub.nextBillingDate) })
          );
        }
      }
      if (sub.reminders.onBillingDate && billingDate.getTime() > now) {
        await scheduleFor(
          sub.id,
          'renew-0',
          billingDate,
          i18n.t('notifications.renewsTodayTitle', { name: sub.name }),
          i18n.t('notifications.renewsTodayBody', { name: sub.name })
        );
      }
    }

    if (sub.reminders.freeTrialEnding && sub.isFreeTrial && sub.trialEndsDate) {
      const trialDate = new Date(sub.trialEndsDate);
      if (trialDate.getTime() > now) {
        await scheduleFor(
          sub.id,
          'trial-end',
          trialDate,
          i18n.t('notifications.trialEndingTitle', { name: sub.name }),
          i18n.t('notifications.trialEndingBody', { name: sub.name })
        );
      }
    }
  }
}
